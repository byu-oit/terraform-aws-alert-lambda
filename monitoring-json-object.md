# Monitoring JSON Object example

The monitoring endpoint is expecting the data to be in this JSON format.

rest_ingest_path                 = "/generic/process-event"

--- 

```
{
         'host': "Host name: Required",
         'element': "Element name: Required",
         'severity': "Severity of the alert (number from 1 - 4 or one of ["CRITICAL", "WARNING"]): Required",
         'alert_output': "Words to display with the alert: Required",
         'element_monitor': "The app reporting the data: Optional",
         'alert_time': "The time of the alert: Optional",
         'address': "The IP address of the host: Optional",
         'ticket': "A ServiceNow Ticket created for the alert: Optional",
         'kb': "The KB for Ops to follow when an alert appears: Required",
         'service': "The ServiceNow Service associated with the host: Optional"

}
```