import { SNSMessage } from 'aws-lambda/trigger/sns'
import { appName, kb } from './env'

export class Notify {
  /**
   *  Host name: Required
   */
  host: string

  /**
   *  Element name: Required
   */
  element: string

  /**
   *  Severity of the alert (number from 1 to 4 or one of ["CRITICAL", "WARNING"]):
   *  Required
   */
  severity: number

  /**
   *  Words to display with the alert: Required
   */
  alert_output: string

  /**
   * The app reporting the data: Optional
   */
  element_monitor?: string

  /**
   * The time of the alert: Optional
   */
  alert_time?: string

  /**
   * The IP address of the host: Optional
   */
  address?: string

  /**
   * A ServiceNow Ticket created for the alert: Optional
   */
  ticket?: string

  /**
   * The KB for Ops to follow when an alert appears: Required
   */
  kb: string

  /**
   * The ServiceNow Service associated with the host: Optional
   */
  service?: string

  constructor (sns: SNSMessage) {
    this.host = appName
    this.kb = kb

    const message = JSON.parse(sns.Message)
    this.element = message.AlarmName
    this.element_monitor = 'AWS CLOUDWATCH'
    this.alert_output = sns.Subject

    // Sentinel Severity Codes
    // 1 Critical
    // 2 Warning
    // 3 Ok
    // 4 Informational
    this.severity = this.alert_output.toUpperCase().startsWith('ALARM') ? 1 : 3

    this.alert_time = sns.Timestamp
    this.address = ''
    this.ticket = ''
    this.service = ''
  }

  toString (): string {
    return JSON.stringify({
      host: this.host,
      element: this.element,
      severity: this.severity,
      alert_output: this.alert_output,
      element_monitor: this.element_monitor,
      alert_time: this.alert_time,
      address: this.address,
      ticket: this.ticket,
      kb: this.kb,
      service: this.service
    })
  }
}
