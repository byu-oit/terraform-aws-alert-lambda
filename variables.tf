variable "app_name" {
  type        = string
  description = "The application name to include in the name of resources created."
  default = ""
}

variable "env" {
  type        = string
  description = "dev for dev, prd for prd"
  default     = true
}

variable "ip_address" {
  type        = string
  description = ""
  default = ""
}

variable "kb_article" {
  type        = string
  description = ""
  default = ""
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

variable "monitoring_api_path" {
  type        = string
  description = "The monitoring api path."
  default     = "/generic/process-event"
}


variable "monitoring_host" {
  type        = string
  description = "The host to ship the Monitoring JSON Object to."
  default     = "in.monitoring.byu.edu" //Dev: "in.monitoringdev.byu.edu"
}

variable "service_now_ticket" {
  type        = string
  description = ""
}

variable "severity" {
  type        = string
  description = ""
}

variable "tags" {
  type        = map(string)
  description = "A map of AWS Tags to attach to each resource created."
  default     = {}
}

variable "ticket" {
  type        = string
  description = ""
}

variable "timeout" {
  type        = number
  description = "The number of seconds the function is allowed to run."
  default     = 30
}