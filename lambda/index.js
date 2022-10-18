const https = require('https')
const URL = require('url').URL

exports.handler = async function (event, context) {
    console.debug('Event: ' + JSON.stringify(event, null, 2))
    if (process.env.SEND_TO_TEAMS === 'false') context.succeed("Skipping sending Teams messages")
    const webhookUrl = new URL(process.env.TEAMS_WEBHOOK_URL)
    try {
        await Promise.all(event.Records.map(record => _sendTeamsMessage(record.Sns.Message ?? record.Sns.ErrorMessage, webhookUrl)))
        console.info('All messages sent successfully.')
    } catch (e) {
        console.error(e)
        context.fail(e)
    }
}

