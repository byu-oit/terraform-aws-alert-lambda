import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
// DO NOT MOVE enableFetchMocks. It must be before other imports.
// Docs: https://www.npmjs.com/package/jest-fetch-mock#to-setup-for-an-individual-test
enableFetchMocks()

import { Callback, Context } from 'aws-lambda'
import { handler } from '../src'
import { SnsEvent } from './assets/snsEvent'

describe('Alert Lambda', () => {
  let context: Context
  let callback: Callback

  beforeEach(() => {
    context = {} as unknown as Context
    callback = jest.fn() as unknown as Callback
    fetchMock.resetMocks()
  })

  it('should send an alert', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await expect(handler(SnsEvent, context, callback)).resolves.toBeDefined()
  })

  it.todo('should fail gracefully')
})
