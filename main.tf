terraform {
  required_version = ">= 1.1.9"
  required_providers {
    aws = ">= 3.75.2"
  }
}

# Additional AWS config
provider "aws" {
  region = "us-west-2"
}

locals {
  add_permission_boundary = length(var.lambda_role_permissions_boundary) > 0
  filename                = "${path.module}/function.zip"
  enable_vpc_for_lambda   = length(var.vpc_id) > 0
  module_name             = "alert-lambda"
}

resource "aws_security_group" "lambda_sg" {
  count  = local.enable_vpc_for_lambda && length(var.security_group_ids) <= 0 ? 1 : 0
  name   = "${var.app_name}-${local.module_name}"
  vpc_id = var.vpc_id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# IAM policies for the run lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}-${local.module_name}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = [
            "lambda.amazonaws.com"
          ]
        },
        Effect = "Allow",
        Sid    = ""
      }
    ]
  })

  permissions_boundary = local.add_permission_boundary ? var.lambda_role_permissions_boundary : null
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/service-role/AWSLambdaENIManagementAccess"
  ]
}

# lambda
resource "aws_lambda_function" "sns_to_operations" {
  function_name    = "${var.app_name}-${local.module_name}"
  filename         = local.filename
  handler          = "dist/index.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_role.arn
  timeout          = var.timeout
  memory_size      = var.memory_size
  source_code_hash = filebase64sha256(local.filename)
  tags             = var.tags

  environment {
    variables = {
      APP_NAME            = var.app_name
      KB_ARTICLE          = var.kb
      MONITORING_HOST     = var.monitoring_host
      MONITORING_API_PATH = var.monitoring_path
    }
  }
  depends_on = [aws_cloudwatch_log_group.logging]

  vpc_config {
    security_group_ids = local.enable_vpc_for_lambda ? length(var.security_group_ids) > 0 ? var.security_group_ids : [aws_security_group.lambda_sg[0].id] : []
    subnet_ids         = local.enable_vpc_for_lambda ? var.subnet_ids : []
  }
}

resource "aws_cloudwatch_log_group" "logging" {
  name              = "/aws/lambda/${var.app_name}/${local.module_name}"
  retention_in_days = var.log_retention_in_days
}

# Lambda permission
resource "aws_lambda_permission" "sns_to_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sns_to_operations.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.alarm_to_lambda.arn
}

# sns Alarm topic and subscription
resource "aws_sns_topic" "alarm_to_lambda" {
  name = "${var.app_name}-${local.module_name}"
}

resource "aws_sns_topic_subscription" "sns_to_lambda" {
  topic_arn = aws_sns_topic.alarm_to_lambda.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.sns_to_operations.arn
}

# Create array of cloud watch alarms
resource "aws_cloudwatch_metric_alarm" "alarms" {
  for_each            = { for config in var.metric_alarm_configs : config.alarm_name => config }
  alarm_name          = each.value.alarm_name
  comparison_operator = each.value.comparison_operator
  evaluation_periods  = each.value.evaluation_periods
  metric_name         = each.value.metric_name
  namespace           = each.value.namespace
  period              = each.value.period
  statistic           = each.value.statistic
  threshold           = each.value.threshold
  alarm_description   = each.value.alarm_description
  alarm_actions       = [aws_sns_topic.alarm_to_lambda.arn]
  ok_actions          = [aws_sns_topic.alarm_to_lambda.arn]
  dimensions          = each.value.dimensions
}
