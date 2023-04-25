![Latest GitHub Release](https://img.shields.io/github/v/release/byu-oit/terraform-aws-alert-lambda?sort=semver)

# Terraform Aws Alert Lambda Module
Lambda for Subscribing to an SNS Topic for CloudWatch Alarm from Metrics and sending it to Operations as the expected JSON object.
See [monitoring-json-object.md](./monitoring-json-object.md) File for and Example...

#### [New to Terraform Modules at BYU?](https://devops.byu.edu/terraform/index.html)

This module deploys a Lambda behind an ALB that receives Alarm Data from Metrics that exists in CloudWatch.
That Alarm Data is then reformatted into the expected format that Operations is expecting to receive.

## Usage
```
module "alert_lambda" {
  source = "github.com/byu-oit/terraform-aws-alert-lambda?ref=v1.0.2"
}
```

## Requirements
* Terraform version 1.1.9 or greater
* AWS Provider 3.75.2 or greater
* BYU-ACS version 3.5.0 or greater


See [examples/simple/simple-example.tf](examples/simple/simple-example.tf) for a working example.
```
module "simple_test" {
  source                           = "../../"
  app_name                         = "alert-lambda-simple-test"
  monitoring_host                  = "https://in.monitoringdev.byu.edu/"
  kb                               = "KB000000"
  lambda_role_permissions_boundary = module.acs.role_permissions_boundary.arn
  vpc_id                           = module.acs.vpc.id
  subnet_ids                       = module.acs.private_subnet_ids
  metric_alarm_configs = [{
    alarm_name          = "simple-test-cpu-utilization-alarm"
    statistic           = "Average"
    metric_name         = "CPUUtilization"
    comparison_operator = "GreaterThanThreshold"
    threshold           = 85
    period              = 60
    evaluation_periods  = 1
    alarm_description   = "Alarm fires on cpu utilization"
    namespace           = "AWS/ECS"
    dimensions = {
      ServiceName = "tyk-identity-api-dev"
      ClusterName = "tyk-identity-api-dev"
    }
  }]
}
```

## Inputs
| Name                             | Type         | Description                                                                                                                      | Default                       |
|----------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| app_name                         | string       | The application name to include in the name of resources created.                                                                |                               |
| kb                               | string       | The KB article identifier for operations to use to resolve the alert. For example, KB0000000                                     |                               |
| monitoring_host                  | string       | The host to ship the Monitoring JSON Object to.                                                                                  | https://in.monitoring.byu.edu |
| monitoring_path                  | string       | The monitoring api path.                                                                                                         | generic/process-event         |
| lambda_role_permissions_boundary | string       | The ARN of the role permissions boundary to attach to the Lambda role.                                                           | ""                            |
| log_retention_in_days            | number       | The number of days to retain logs for the sns-to-teams Lambda.                                                                   | 7                             |
| memory_size                      | number       | The amount of memory for the function.                                                                                           | 128                           |
| timeout                          | number       | The number of seconds the function is allowed to run.                                                                            | 30                            |
| tags                             | map(string)  | A map of AWS Tags to attach to each resource created.                                                                            | {}                            |
| metric_alarm_configs             | list(map)    | Array of Alarm objects                                                                                                           | see example in variables.tf   |
| vpc_id                           | string       | Use a VPC for the lambda ingester functions. Pass in a vpc to enable.                                                            | ""                            |
| security_group_ids               | list(string) | A list of security group ids for the VPC configuration regarding the ingester lambda functions. Only required if VPC is enabled. | []                            |
| period                           | number       | (Optional) The period in seconds over which the specified statistic is applied.                                                  |                               |

### "metric_alarm_configs" Object Types supported from variatles.tf:53-67
```
variable "metric_alarm_configs" {
  type = list(object({
    alarm_name          = string
    statistic           = string
    metric_name         = string
    namespace           = string
    comparison_operator = string
    threshold           = number
    period              = number
    evaluation_periods  = number
    alarm_description   = string
    dimensions          = map(string)
  }))
  description = "Array of Alarm objects"
}
```

## Outputs
| Name | Type | Description |
|------|------|-------------|
|      |      |             |

## Future Modifications...
If you need to modify the standard SNS Topic for something special..
See [Terraform aws_sns_topic](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic)

There are several configurable Alarm Metric Alarm inputs that you can work with.
See [Terraform aws_cloudwatch_metric_alarm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm)
