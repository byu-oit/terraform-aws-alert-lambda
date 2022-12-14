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

module "ci_test" {
  source                           = "../../"
  app_name                         = "alert-lambda-module-test"
  monitoring_host                  = "https://in.monitoringdev.byu.edu/"
  kb                               = "KB0000000"
  lambda_role_permissions_boundary = module.acs.role_permissions_boundary.arn
  vpc_id                           = module.acs.vpc.id
  subnet_ids                       = module.acs.private_subnet_ids
  metric_alarm_configs             = []
}

