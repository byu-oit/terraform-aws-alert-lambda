variable "app_name" {
  type        = string
  description = "The application name to include in the name of resources created."
}

variable "kb" {
  type = string
  description = "The KB article identifier for operations to use to resolve the alert. For example, KB0000000"
}

variable "monitoring_host" {
  type        = string
  description = "The host to ship the Monitoring JSON Object to."
  default     = "https://in.monitoring.byu.edu"
}

variable "monitoring_path" {
  type        = string
  description = "The monitoring api path."
  default     = "/generic/process-event"
}

variable "lambda_role_permissions_boundary" {
  type        = string
  description = "The ARN of the role permissions boundary to attach to the Lambda role."
  default     = ""
}

variable "log_retention_in_days" {
  type        = number
  description = "The number of days to retain logs for the sns-to-teams Lambda."
  default     = 14
}

variable "memory_size" {
  type        = number
  description = "The amount of memory for the function."
  default     = 128
}

variable "timeout" {
  type        = number
  description = "The number of seconds the function is allowed to run."
  default     = 30
}

variable "tags" {
  type        = map(string)
  description = "A map of AWS Tags to attach to each resource created."
  default     = {}
}

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
