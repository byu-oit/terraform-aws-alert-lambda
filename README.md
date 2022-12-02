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
  source = "github.com/byu-oit/terraform-aws-alert-lambda?ref=v1.0.0"
}
```

## Requirements
* Terraform version 1.1.9 or greater
* AWS Provider 3.75.2 or greater
* BYU-ACS version 3.5.0 or greater
* 
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

If you need to modify the standard SNS Topic for something special..
See [Terraform aws_sns_topic](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic)

There are several configurable Alarm Metric Alarm inputs that you can work with.
See [Terraform aws_cloudwatch_metric_alarm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm)
## Inputs
| Name                                  | Type         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default |
|---------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| alarm_name                            | string       | (Required) The descriptive name for the alarm. This name must be unique within the user's AWS account                                                                                                                                                                                                                                                                                                                                                                                       |         |
| comparison_operator                   | string       | (Required) The arithmetic operation to use when comparing the specified Statistic and Threshold. The specified Statistic value is used as the first operand. Either of the following is supported: GreaterThanOrEqualToThreshold, GreaterThanThreshold, LessThanThreshold, LessThanOrEqualToThreshold. Additionally, the values LessThanLowerOrGreaterThanUpperThreshold, LessThanLowerThreshold, and GreaterThanUpperThreshold are used only for alarms based on anomaly detection models. |         |
| evaluation_periods                    | number       | (Required) The number of periods over which data is compared to the specified threshold.                                                                                                                                                                                                                                                                                                                                                                                                    |         |
| metric_name                           | string       | (Optional) The name for the alarm's associated metric. See docs for supported metrics.                                                                                                                                                                                                                                                                                                                                                                                                      |         |
| period                                | number       | (Optional) The period in seconds over which the specified statistic is applied.                                                                                                                                                                                                                                                                                                                                                                                                             |         |
| statistic                             | string       | (Optional) The statistic to apply to the alarm's associated metric. Either of the following is supported: SampleCount, Average, Sum, Minimum, Maximum                                                                                                                                                                                                                                                                                                                                       |         |
| threshold                             | number       | (Optional) The value against which the specified statistic is compared. This parameter is required for alarms based on static thresholds, but should not be used for alarms based on anomaly detection models.                                                                                                                                                                                                                                                                              |         |
| threshold_metric_id                   | string       | (Optional) If this is an alarm based on an anomaly detection model, make this value match the ID of the ANOMALY_DETECTION_BAND function.                                                                                                                                                                                                                                                                                                                                                    |         |
| actions_enabled                       | string       | (Optional) Indicates whether or not actions should be executed during any changes to the alarm's state. Defaults to true.                                                                                                                                                                                                                                                                                                                                                                   |         |
| alarm_actions                         | list(string) | (Optional) The list of actions to execute when this alarm transitions into an ALARM state from any other state. Each action is specified as an Amazon Resource Name (ARN).                                                                                                                                                                                                                                                                                                                  |         |
| alarm_description                     | string       | (Optional) The description for the alarm.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |         |
| datapoints_to_alarm                   | string       | (Optional) (Optional) The number of datapoints that must be breaching to trigger the alarm.                                                                                                                                                                                                                                                                                                                                                                                                 |         |
| insufficient_data_actions             | list(string) | (Optional) The list of actions to execute when this alarm transitions into an INSUFFICIENT_DATA state from any other state. Each action is specified as an Amazon Resource Name (ARN).                                                                                                                                                                                                                                                                                                      |         |
| ok_actions                            | list(string) | (Optional) The list of actions to execute when this alarm transitions into an OK state from any other state. Each action is specified as an Amazon Resource Name (ARN).                                                                                                                                                                                                                                                                                                                     |         |
| unit                                  | string       | (Optional) The unit for the alarm's associated metric.                                                                                                                                                                                                                                                                                                                                                                                                                                      |         |
| extended_statistic                    | string       | (Optional) The percentile statistic for the metric associated with the alarm. Specify a value between p0.0 and p100.                                                                                                                                                                                                                                                                                                                                                                        |         |
| treat_missing_data                    | string       | (Optional) Sets how this alarm is to handle missing data points. The following values are supported: missing, ignore, breaching and notBreaching. Defaults to missing.                                                                                                                                                                                                                                                                                                                      |         |
| evaluate_low_sample_count_percentiles | string       | (Optional) Used only for alarms based on percentiles. If you specify ignore, the alarm state will not change during periods with too few data points to be statistically significant. If you specify evaluate or omit this parameter, the alarm will always be evaluated and possibly change state no matter how many data points are available. The following values are supported: ignore, and evaluate.                                                                                  |         |
| metric_query                          | string       | (Optional) Enables you to create an alarm based on a metric math expression. You may specify at most 20.                                                                                                                                                                                                                                                                                                                                                                                    |         |
| tags                                  | string       | (Optional) A map of tags to assign to the resource. If configured with a provider default_tags configuration block present, tags with matching keys will overwrite those defined at the provider-level.                                                                                                                                                                                                                                                                                     |         |


## Outputs
| Name | Type | Description |
|------|------|-------------|
|      |      |             |
