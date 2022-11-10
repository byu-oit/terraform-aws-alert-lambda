import ByuLogger from '@byu-oit/logger'
import { Handler, SNSEvent } from 'aws-lambda'
import fetch, { Headers } from 'node-fetch'
import { Notify } from './notify'
import { appName, host, path } from './env'

const logger = ByuLogger({
  mixin () {
    return { app: appName }
  }
})

export const handler: Handler<SNSEvent> = async function handler (event, context) {
  if (event.Records.length > 1) {
    context.fail('Too many records found in the sns event. Right now we only support' +
      ' sending one event at a time')
    return
  }

  const result = await fetch(`${host}${path}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: new Notify(event.Records[0].Sns).toString()
  })
  const json = await result.json()

  const { status, statusText } = result
  if (!result.ok) {
    logger.error({ json, status, statusText })
    context.fail(new LambdaFail(`Failed to send alert to ${host} with status code ${status}.`))
    return
  }

  context.succeed(new LambdaSucceed(`Sent alert to ${host} with status code ${status}`, json))
}

class LambdaFail extends Error {
  data?: Record<string, unknown>
  constructor (msg: string, data?: Record<string, unknown>) {
    super(msg)
    this.data = data
  }
}

class LambdaSucceed {
  message: string
  data?: Record<string, unknown>
  constructor (msg: string, data?: Record<string, unknown>) {
    this.message = msg
    this.data = data
  }
}
