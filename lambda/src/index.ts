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

export const handler: Handler<SNSEvent, LambdaSucceed> = async function handler (event) {
  if (event.Records.length > 1) {
    const msg = `Too many records found in the sns event. Right now we only support sending one event at a time`
    logger.error({ event }, msg)
    throw new LambdaFail(msg)
  }
  logger.info(`url = ${host}${path}`)
  const notify =  new Notify(event.Records[0].Sns).toString()
  logger.info(`Notify = ${notify}`)
  const result = await fetch(`${host}${path}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: notify
  })
  const body = await result.json()
  const response = { json: body, status: result.status, statusText: result.statusText }

  if (!result.ok) {
    const msg = `Failed to send alert to ${host}.`
    logger.error({ response }, msg)
    throw new LambdaFail(msg, response)
  }

  const msg = `Sent alert to ${host}.`
  logger.info({ response }, msg)
  return new LambdaSucceed(msg, body)
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
