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


