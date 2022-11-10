![Latest GitHub Release](https://img.shields.io/github/v/release/byu-oit/terraform-aws-alert-lambda?sort=semver)

# Terraform Aws Alert Lambda Module
Lambda for Subscribing to an SNS Topic for CloudWatch Alarm from Metrics
and sending it to Operations as the expected JSON object.

#### [New to Terraform Modules at BYU?](https://devops.byu.edu/terraform/index.html)

## Usage
```hcl
module "alert_lambda" {
  source = "github.com/byu-oit/terraform-aws-alert-lambda?ref=v1.0.0"
}
```

## Requirements
* Terraform version 1.1.9 or greater

## Inputs
| Name | Type | Description | Default |
|------|------|-------------|---------|
|      |      |             |         |

## Outputs
| Name | Type | Description |
|------|------|-------------|
|      |      |             |
