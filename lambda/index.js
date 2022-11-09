// const querystring = require('querystring')
// const https = require('https')
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    let message = ""
    function logItem(name, item, with_break = false){
        let needsStringify = (typeof item === 'object')
        if(message.length === 0) message += "Log data :" + '\n'
        message += (name + " : " + (needsStringify? JSON.stringify(item) : item)) + '\n'
        if(with_break === true) message += "\n-----\n"
    }

    function printLog(){
        console.log(message)
    }

    function printLogError(message){
        console.log("The Lambda entered an error condition Exit!! line: " + line)
    }

    // EXAMPLE Notify Object data created.   just for testing, this will be overwritten by the actual output
    let the_host = "terraform-aws-alert-lambda-to-operations--example"
    let the_element = "aws CloudWatch alarm"
    let the_severity = "CRITICAL"
    let the_alert_output = `OK: \\"simple-test-cpu-utilization-alarm\\" in US West (Oregon)`
    let the_element_monitor = "metric throwing the alert"
    let the_alert_time = ""   //Date.now()
    let the_ip_address = ""
    let the_ticket = ""
    let the_kb = "KB0000000"
    let the_service = "Tyk's TIM service"

    let notify_obj =     {
        host : the_host,                        // Host name: Required
        element : the_element,                  // Element name: Required
        severity : the_severity,                // Severity of the alert (number from 1 to 4 or one of ["CRITICAL", "WARNING"]): Required
        alert_output : the_alert_output,        // Words to display with the alert: Required
        element_monitor: the_element_monitor,   // "The app reporting the data: Optional"
        alert_time : the_alert_time,            // "The time of the alert: Optional"
        address : the_ip_address,               // "The IP address of the host: Optional"
        ticket: the_ticket,                     // "A ServiceNow Ticket created for the alert: Optional"
        kb: the_kb,                             // "The KB for Ops to follow when an alert appears: Required"
        service : the_service                   // "The ServiceNow Service associated with the host: Optional"
    }
    logItem("SAMPLE Notify Object", notify_obj)

    function setSeverity(alarmName){
        logItem("alarmName", alarmName)
        if(alarmName.startsWith("ALARM")) notify_obj.severity = "CRITICAL"
        else if(alarmName.startsWith("OK")) notify_obj.severity = "OK"
        else notify_obj.severity = "INFO"
        logItem("Severity", notify_obj.severity)
    }

    /*
    There's A LOT of information that comes in from the AWS ALERTS SYSTEM.
    The log output lets you look at all of it and determine what is needed.
    In changes are needed just uncomment the logItem code to see it all.
    This is where I landed, you may have different needs.  We tried to plan for
    future needs, but things will change over time.
     */
    function put_alarm_data_in_notify_obj(item) {
        //logItem('item.EventSource = ', item.EventSource)
        notify_obj.host = process.env.APP_NAME
        //logItem('item.EventVersion = ', item.EventVersion)
        //logItem('item.EventSubscriptionArn = ', item.EventSubscriptionArn, true)

        let sns = item.Sns
        //logItem("sns.Type = ", sns.Type)
        //logItem("sns.MessageId = ", sns.MessageId)
        //logItem("sns.TopicArn = ", sns.TopicArn)
        //logItem("sns.Subject = ", sns.Subject)
        notify_obj.alert_output = sns.Subject
        setSeverity(notify_obj.alert_output)

        let mess_obj = JSON.parse(sns.Message)
        //logItem("sns.Message = ", mess_obj)
        //logItem("sns.Message.AlarmName = ", mess_obj.AlarmName)
        notify_obj.element = mess_obj.AlarmName

        //logItem("sns.Subject = ", sns.Subject)
        //logItem("sns.Message.AlarmDescription = ", mess_obj.AlarmDescription)
        //logItem("sns.Message.AWSAccountId = ", mess_obj.AWSAccountId)
        //logItem("sns.Message.AlarmConfigurationUpdatedTimestamp = ", mess_obj.AlarmConfigurationUpdatedTimestamp)
        //logItem("sns.Message.NewStateValue = ", mess_obj.NewStateValue)
        //logItem("sns.Message.NewStateReason = ", mess_obj.NewStateReason)
        //logItem("sns.Message.StateChangeTime = ", mess_obj.StateChangeTime)
        //logItem("sns.Message.Region = ", mess_obj.Region)
        //logItem("sns.Message.AlarmArn = ", mess_obj.AlarmArn)

        //logItem("sns.Message.OldStateValue = ", mess_obj.OldStateValue)
        //logItem("sns.Message.OKActions = ", mess_obj.OKActions)
        //logItem("sns.Message.AlarmActions = ", mess_obj.AlarmActions)
        //logItem("sns.Message.InsufficientDataActions = ", mess_obj.InsufficientDataActions)
        //logItem("sns.Message.Trigger = ", mess_obj.Trigger)

        notify_obj.element_monitor = "AWS Alarm Trigger: " + JSON.stringify(mess_obj.Trigger)
        // logItem("notify_obj.element_monitor = ", notify_obj.element_monitor)

        // rest of the sns object
        // logItem("sns.Timestamp = ", sns.Timestamp)
        notify_obj.alert_time = sns.Timestamp

        // logItem("sns.SignatureVersion = ", sns.SignatureVersion)
        // logItem("sns.Signature = ", sns.Signature)
        // logItem("sns.SigningCertUrl = ", sns.SigningCertUrl)
        // logItem("sns.UnsubscribeUrl = ", sns.UnsubscribeUrl)
        // logItem("sns.MessageAttributes = ", sns.MessageAttributes, true)

        notify_obj.address = ""
        notify_obj.ticket = ""
        notify_obj.service = ""
        // logItem("notify_obj.kb: ", notify_obj.kb)

        logItem("UPDATED: Notify Object", notify_obj, true)
    }

    let post_success = false
    async function post_notify_object(host, path) {
        logItem("starting post_notify_object(host, path)", host, true)
        // const post_body = querystring.stringify(notify_obj)
        // logItem("post_body", post_body)
        // const options = {
        //     hostname: host,
        //     port: 443,
        //     path: path,
        //     method: 'POST',
        //     headers : {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Content-Length': post_body.length
        //     }
        // };

        const url = "https://" + host + path
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(notify_obj),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        logItem("reesponse", data)
        // const post_rq = https.request( options, (res) => {
        //     console.log('statusCode:' +  res.statusCode);
        //     console.log('headers:' + res.headers);
        //     if(res.statusCode === 200) {
        //         post_success = true
        //     } else {
        //         console.log("other status received..")
        //     }
        //
        // });
        // post_rq.write(post_body);
        // post_rq.end();
    }

    // logItem("typeof process.env.IN_DEV", typeof process.env.IN_DEV)
    logItem("process.env.IN_DEV = ", process.env.IN_DEV)
    if (process.env.IN_DEV === 'true') {
        //logItem("process.env.IN_DEV === ", "true" )
        //logItem('event.Records count=', event.Records.length, true)
        if(event.Records.length === 1){
            let item = event.Records[0]
            put_alarm_data_in_notify_obj(item)
            logItem("host/path", process.env.DEV_MONITORING_HOST+process.env.MONITORING_API_PATH)
            await post_notify_object(process.env.DEV_MONITORING_HOST, process.env.MONITORING_API_PATH)
            printLog()
            if(post_success === true) context.succeed("IN_DEV call resulted in Success!")
        } else {
            printLogError("Too many Records items found in the event...!!")
        }
    }
    else { // process.env.IN_DEV !== 'true'
        // only one event item is expected at the time of this implementation
        if(event.Records.length === 1){
            let item = event.Records[0]
            put_alarm_data_in_notify_obj(item)
            logItem("host/path", process.env.MONITORING_HOST+process.env.MONITORING_API_PATH)
            await post_notify_object(process.env.MONITORING_HOST, process.env.MONITORING_API_PATH)
            printLog()
            if(post_success === true) context.succeed("IN_DEV call resulted in Success!")
        } else {
            printLogError("Too many Records items found in the event...!!")
        }
    }
}