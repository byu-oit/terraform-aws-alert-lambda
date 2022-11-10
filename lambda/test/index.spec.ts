import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
// DO NOT MOVE enableFetchMocks. It must be before other imports.
// Docs: https://www.npmjs.com/package/jest-fetch-mock#to-setup-for-an-individual-test
enableFetchMocks()

import { Context } from 'aws-lambda'
import { handler } from '../src'
import { SnsEvent } from './assets/snsEvent'

class LambdaContext {
  fail = jest.fn()
  succeed = jest.fn()
}

describe('Alert Lambda', () => {
  let context: Context

  beforeEach(() => {
    context = new LambdaContext() as unknown as Context
    fetchMock.resetMocks()
  })

  it('should sends an alert', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await handler(SnsEvent, context, () => {})
    expect(context.succeed).toHaveBeenCalledTimes(1)
  })

  it.todo('should fail gracefully')
})
