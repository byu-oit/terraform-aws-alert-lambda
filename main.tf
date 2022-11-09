terraform {
  required_version = ">= 1.1.9"
  required_providers {
    aws = ">= 3.73.0"
  }
}

# Additional AWS config
provider "aws" {
  region = "us-west-2"
}

locals {
  add_permission_boundary = length(var.lambda_role_permissions_boundary) > 0
  filename                = "${path.module}/lambda/function.zip"
}

# IAM policies for the run lambda
resource "aws_iam_role" "lambda_role" {
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
  managed_policy_arns  = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]
}

# lambda
resource "aws_lambda_function" "sns_to_operations" {
  function_name    = "${var.app_name}-sns-to-operations"
  filename         = local.filename
  handler          = "index.handler"
  runtime          = "nodejs14.x"
  role             = aws_iam_role.lambda_role.arn
  timeout          = var.timeout
  memory_size      = var.memory_size
  source_code_hash = filebase64sha256(local.filename)
  tags             = var.tags

  environment {
    variables = {
      APP_NAME            = var.app_name
      IN_DEV              = var.in_dev
      MONITORING_HOST     = var.monitoring_host
      DEV_MONITORING_HOST = var.dev_monitoring_host
      MONITORING_API_PATH = var.monitoring_api_path
    }
  }
  depends_on = [aws_cloudwatch_log_group.logging]
}

resource "aws_cloudwatch_log_group" "logging" {
  name              = "/aws/lambda/${var.app_name}-sns-to-operations"
  retention_in_days = var.log_retention_in_days
}

# Lambda permission
resource "aws_lambda_permission" "sns_to_operations" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sns_to_operations.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.sns_to_operations.arn
}

# sns Alarm topic and subscription
resource "aws_sns_topic" "sns_to_operations" {
  name = "${var.app_name}-sns-to-operations"
}

resource "aws_sns_topic_subscription" "lambda" {
  topic_arn = aws_sns_topic.sns_to_operations.arn
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
  alarm_actions       = [aws_sns_topic.sns_to_operations.arn]
  ok_actions          = [aws_sns_topic.sns_to_operations.arn]
  dimensions          = each.value.dimensions
}



