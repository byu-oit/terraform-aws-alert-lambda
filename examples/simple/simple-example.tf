provider "aws" {
  version = "~> 3.73.0"
  region  = "us-west-2"
}

module "alert_lambda" {
  source = "github.com/byu-oit/terraform-aws-alert-lambda?ref=v1.0.0"
  #source = "../" # for local testing during module development
}
