/*******************************************************************************
* File: index.js
* Summary: Basic Lambda function to send alert to Ops based off of aws sns
*
*  ~ Holiness to the Lord ~
*******************************************************************************/

// Test values to be replaced by Terraform
let the_host = "terraform-aws-alert-lambda-to-operations--example"
let the_element = "aws CloudWatch alarm"
let the_severity = "CRITICAL"
let the_alert_output = `{"AlarmName":"tim-cpu-alarm-test","AlarmDescription":"Testing for the Alarms processing Lambda","AWSAccountId":"598052082689","AlarmConfigurationUpdatedTimestamp":"2022-10-18T20:01:25.573+0000","NewStateValue":"OK","NewStateReason":"Threshold Crossed: 1 out of the last 1 datapoints [0.05164275070031484 (18/10/22 20:13:00)] was not greater than the threshold (0.059) (minimum 1 datapoint for ALARM -> OK transition).","StateChangeTime":"2022-10-18T20:15:10.941+0000","Region":"US West (Oregon)","AlarmArn":"arn:aws:cloudwatch:us-west-2:598052082689:alarm:tim-cpu-alarm-test","OldStateValue":"ALARM","OKActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"AlarmActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"InsufficientDataActions":[],"Trigger":{"MetricName":"CPUUtilization","Namespace":"AWS/ECS","StatisticType":"Statistic","Statistic":"AVERAGE","Unit":null,"Dimensions":[{"value":"tyk-identity-api-dev","name":"ServiceName"},{"value":"tyk-identity-api-dev","name":"ClusterName"}],"Period":60,"EvaluationPeriods":1,"DatapointsToAlarm":1,"ComparisonOperator":"GreaterThanThreshold","Threshold":0.059,"TreatMissingData":"missing","EvaluateLowSampleCountPercentile":""}}`
let the_element_monitor = "this lambda project"
let the_alert_time = Date.now()
let the_ip_address = "127.0.0.1"
let the_ticket = ""
let the_kb = "KB0000000"
let the_service = "Tyk's TIM service"



/*******************************************************************************
* Function: server
* Description: Set up the express app, add logger middleware, open api enforcer,
*              and attach routes.
*******************************************************************************/
async function lambda (event, context)
{
    // Response body to return
    let response =
    {
        statusCode: 200,
        body: "OK"
    }

    try
    {
        // If there are too many events, throw and end.
        if(event.Records.length !== 1)
        {
            throw new Error("Found either no record, or more than 1")
        }

        // Variables for easier handling
        let eventSns = event.Records[0].sns
        let eventSnsMessageParsed = JSON.parse(eventSns.Message)
        let url = "https://" + process.env.MONITORING_HOST + "" + process.env.MONITORING_API_PATH

        //Todo: Remove this, just for testing:
        console.log(eventSns)

        //Todo: Remove this, just for testing:
        console.log(eventSnsMessageParsed)

        // Setting up the "notify" object
        let notify_obj =
        {
            host : process.env.APP_NAME,                                                            // Host name: Required
            element : eventSnsMessageParsed.AlarmName,                                              // Element name: Required
            severity : process.env.Severity,                                                        // Severity (number from 1 to 4 or one of ["CRITICAL", "WARNING"]): Required
            alert_output : eventSns.Subject,                                                        // Words to display with the alert: Required
            element_monitor: "AWS Alarm Trigger: " + JSON.stringify(eventSnsMessageParsed.Trigger), //"The app reporting the data: Optional"
            alert_time : eventSns.Timestamp,                                                        // "The time of the alert: Optional"
            address : process.env.IP_ADDRESS,                                                       //"The IP address of the host: Optional"
            ticket: process.env.SERVICE_NOW_TICKET,                                                 // "A ServiceNow Ticket created for the alert: Optional"
            kb: process.env.KB_ARTICLE_NUMBER,                                                      // "The KB for Ops to follow when an alert appears: Required"
            service : process.env.SERVICE_NOW_SERVICE                                               // "The ServiceNow Service associated with the host: Optional"
        }

        // Send the message
        // await Promise.all(event.Records.map(record => _sendTeamsMessage(record.Sns.Message ?? record.Sns.ErrorMessage, webhookUrl)))

        //Todo: Remove this, just for testing:
        console.log(notify_obj)

        return response;
    }
    catch(e)
    {
        // Log Error for response, and return status Code
        console.log("index.js: Error - " + e);

        response.statusCode = 500;
        response.body = "Internal Server Error"
        return response;
    }
}

exports.handler = lambda;