variable "app_name" {
  type        = string
  description = "The application name to include in the name of resources created."
}

variable "monitoring_host" {
  type        = string
  description = "The host to ship the Monitoring JSON Object to."
  default     = "in.monitoring.byu.edu"
}

variable "lambda_role_permissions_boundary" {
  type        = string
  description = "The ARN of the role permissions boundary to attach to the Lambda role."
  default     = ""
}

# people need to be able to pass in an array of configuration items ..   Metric, Event, Condition.

