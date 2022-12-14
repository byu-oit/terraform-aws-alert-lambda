export const SnsEvent = {
  'Records': [
    {
      'EventSource': 'aws:sns',
      'EventVersion': '1.0',
      'EventSubscriptionArn': 'arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations:513df0b0-bacc-44b7-887e-147b1ec36062',
      'Sns': {
        'Type': 'Notification',
        'MessageId': '866afb5a-09d4-5787-a712-a093025a348e',
        'TopicArn': 'arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations',
        'Subject': 'OK: "tim-cpu-alarm-test" in US West (Oregon)',
        'Message': '{"AlarmName":"tim-cpu-alarm-test","AlarmDescription":"Testing for the Alarms processing Lambda","AWSAccountId":"598052082689","AlarmConfigurationUpdatedTimestamp":"2022-10-18T20:01:25.573+0000","NewStateValue":"OK","NewStateReason":"Threshold Crossed: 1 out of the last 1 datapoints [0.05164275070031484 (18/10/22 20:13:00)] was not greater than the threshold (0.059) (minimum 1 datapoint for ALARM -> OK transition).","StateChangeTime":"2022-10-18T20:15:10.941+0000","Region":"US West (Oregon)","AlarmArn":"arn:aws:cloudwatch:us-west-2:598052082689:alarm:tim-cpu-alarm-test","OldStateValue":"ALARM","OKActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"AlarmActions":["arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations"],"InsufficientDataActions":[],"Trigger":{"MetricName":"CPUUtilization","Namespace":"AWS/ECS","StatisticType":"Statistic","Statistic":"AVERAGE","Unit":null,"Dimensions":[{"value":"tyk-identity-api-dev","name":"ServiceName"},{"value":"tyk-identity-api-dev","name":"ClusterName"}],"Period":60,"EvaluationPeriods":1,"DatapointsToAlarm":1,"ComparisonOperator":"GreaterThanThreshold","Threshold":0.059,"TreatMissingData":"missing","EvaluateLowSampleCountPercentile":""}}',
        'Timestamp': '2022-10-18T20:15:10.991Z',
        'SignatureVersion': '1',
        'Signature': 'xWQwSDw/bk3ubvV/XpE9H0uo+PM4bLEWgXOZ+EBzK1KF00JwY3S9zx4HPrcNOaZn8IJtc/uW0liVp2nuJmkuXk2mmZ5H28oHRSM52kxFGLyE8KZ3owDC9NHwnNeEZE55wyhkezQSCOd4pfAEBeaHbFpGpUN5XX98zxp2To+hEosxOYBlmFaVHagsoTVe1SW4IxsOAtdR/wFfSrEYS+K3Ce+3d4yEv4XkGPMMM9J6QvDtu4ABTJcGjn7xHIFj6ckAtLQ/4934EHlO72uAIYdk8Sqh3xrBhgR+FdhK8wRfwKHfX5mPbweHW/d2nKCJ/qSNmRWi8ovsJODzYcecShBuLw==',
        'SigningCertUrl': 'https://sns.us-west-2.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem',
        'UnsubscribeUrl': 'https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:598052082689:alert-lambda-simple-test-sns-to-operations:513df0b0-bacc-44b7-887e-147b1ec36062',
        'MessageAttributes': {}
      }
    }
  ]
}
