//const https = require('https')
//const URL = require('url').URL

exports.handler = async function (event, context) {
    let message = ""
    function logItem(name, item){
        let needsStringify = (typeof item === 'object')
        if(message.length>0) message += '\n'
        message += (name + " : " + (needsStringify? JSON.stringify(item) : item))
    }

    function printLog(){
        console.log(message)
    }

    function printLogError(line){
        console.log("The Lambda entered an error condition Exit!! line: " + line)
    }

    let the_host = "api-dev.byu.edu"
    let the_element = "aws CloudWatch alarm"
    let the_severity = "CRITICAL"
    let the_alert_output = `"{"AlarmName":"tim-cpu-alarm-test","AlarmDescription":"Testing for the Alarms processing Lambda","AWSAccountId":"598052082689","AlarmConfigurationUpdatedTimestamp":"2022-10-18T20:01:25.573+0000","NewStateValue":"OK","NewStateReason":"Threshold Crossed: 1 out of the last 1 datapoints [0.05164275070031484 (18/10/22 20:13:00)] was not greater than the threshold (0.059) (minimum 1 datapoint for ALARM -> OK transition).","StateChangeTime":"2022-10-18T20:15:10.941+0000","Region":"US West (Oregon)","AlarmArn":"arn:aws:cloudwatch:us-west-2:598052082689:alarm:tim-cpu-alarm-test","OldStateValue":"ALARM","OKActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"AlarmActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"InsufficientDataActions":[],"Trigger":{"MetricName":"CPUUtilization","Namespace":"AWS/ECS","StatisticType":"Statistic","Statistic":"AVERAGE","Unit":null,"Dimensions":[{"value":"tyk-identity-api-dev","name":"ServiceName"},{"value":"tyk-identity-api-dev","name":"ClusterName"}],"Period":60,"EvaluationPeriods":1,"DatapointsToAlarm":1,"ComparisonOperator":"GreaterThanThreshold","Threshold":0.059,"TreatMissingData":"missing","EvaluateLowSampleCountPercentile":""}}"`
    let the_element_monitor = "this lambda project"
    let the_alert_time = Date.now()
    let the_ip_address = "127.0.0.1"
    let the_ticket = "INC050xxxx"
    let the_kb = "KB00xxxxx"
    let the_service = "Tyk's TIM service"

    let notify_obj =     {
        host : the_host,                        // Host name: Required
        element : the_element,                  // Element name: Required
        severity : the_severity,                // Severity of the alert (number from 1 to 4 or one of ["CRITICAL", "WARNING"]): Required
        alert_output : the_alert_output,        // Words to display with the alert: Required
        element_monitor: the_element_monitor,   //"The app reporting the data: Optional"
        alert_time : the_alert_time,            // "The time of the alert: Optional"
        address : the_ip_address,               //"The IP address of the host: Optional"
        ticket: the_ticket,                     // "A ServiceNow Ticket created for the alert: Optional"
        kb: the_kb, // "The KB for Ops to follow when an alert appears: Required"
        service : the_service  // "The ServiceNow Service associated with the host: Optional"
    }
    logItem("sample Notify Object", notify_obj)

    logItem("typeof process.env.IN_DEV", typeof process.env.IN_DEV)
    logItem("process.env.IN_DEV = ", process.env.IN_DEV)
    if (process.env.IN_DEV === 'true') {
        logItem("process.env.IN_DEV === ", "true" )
        logItem('event.Records count=', event.Records.length)
        if(event.Records.length === 1){
            let item = event.Records[0]
            logItem('item.EventSource = ', item.EventSource)
            logItem('item.EventVersion = ', item.EventVersion)
            logItem('item.EventSubscriptionArn = ', item.EventSubscriptionArn)
            let sns = item.Sns
            logItem("sns.Type = ", sns.Type)
            logItem("sns.MessageId = ", sns.MessageId)
            logItem("sns.TopicArn = ", sns.TopicArn)
            logItem("sns.Subject = ", sns.Subject)

            printLog()
            context.succeed("IN_DEV call resulted in Success!")
        } else {
            printLogError("22")
            logItem("Too many Records items found in the event...!!")
        }
    }
    else {
        printLogError( "27 .. process.env.IN_DEV !== 'true'")
        context.succeed("Production Request resulted on Success.")
    }

    // const webhookUrl = new URL(process.env.TEAMS_WEBHOOK_URL)
    // try {
    //     await Promise.all(event.Records.map(record => _sendTeamsMessage(record.Sns.Message ?? record.Sns.ErrorMessage, webhookUrl)))
    //     console.info('All messages sent successfully.')
    // } catch (e) {
    //     console.error(e)
    //     context.fail(e)
    // }
}