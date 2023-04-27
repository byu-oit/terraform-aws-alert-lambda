terraform {
  required_version = ">= 1.1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.75.2"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

module "acs" {
  source            = "github.com/byu-oit/terraform-aws-acs-info?ref=v3.5.0"
  vpc_vpn_to_campus = true
}

module "alert_lambda" {
  source                           = "github.com/byu-oit/terraform-aws-alert-lambda?ref=v1.0.2"
  app_name                         = "my-app-dev"
  monitoring_host                  = "https://in.monitoringdev.byu.edu/"
  kb                               = "KB000000"
  lambda_role_permissions_boundary = module.acs.role_permissions_boundary.arn
  vpc_id                           = module.acs.vpc.id
  subnet_ids                       = module.acs.private_subnet_ids
  metric_alarm_configs = [{
    alarm_name          = "my-app-dev-cpu-utilization-alarm"
    statistic           = "Average"
    metric_name         = "CPUUtilization"
    comparison_operator = "GreaterThanThreshold"
    threshold           = 85
    period              = 60
    evaluation_periods  = 1
    alarm_description   = "Alarm fires on cpu utilization"
    namespace           = "AWS/ECS"
    dimensions = {
      ServiceName = "my-app-dev"
      ClusterName = "my-app-dev"
    }
  }]
}
