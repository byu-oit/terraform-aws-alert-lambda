terraform {
  required_version = ">= 1.1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.79.0"
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
  app_name                         = "alert_lambda_module_test"
  monitoring_host                  = "in.monitoringdev.byu.edu"
  lambda_role_permissions_boundary = module.acs.role_permissions_boundary.arn
}

