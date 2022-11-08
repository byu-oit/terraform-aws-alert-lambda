terraform {
  required_version = ">= 1.1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.73.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v3.5.0"
}

module "ci_test" {
  source                           = "../../"
  app_name                         = "alert-lambda-simple-test"
  monitoring_host                  = "in.monitoringdev.byu.edu"
  lambda_role_permissions_boundary = module.acs.role_permissions_boundary.arn
  metric_alarm_configs = [{
    alarm_name          = "simple-test-cpu-utilization-alarm"
    statistic           = "Average"
    metric_name         = "CPUUtilization"
    comparison_operator = "GreaterThanThreshold"
    threshold           = 0.041
    period              = 60
    evaluation_periods  = 1
    alarm_description   = "test fires on cpu utilization"
    namespace           = "AWS/ECS"
    dimensions = {
      ServiceName = "tyk-identity-api-dev"
      ClusterName = "tyk-identity-api-dev"
    }
  }]
}