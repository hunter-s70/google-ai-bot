// import {ApiAiClient} from "api-ai-javascript";

const Telegraf = require('telegraf');
// const client = new ApiAiClient({accessToken: 'd06d1a7b60944422b1386c88123696ce'});

const bot = new Telegraf('API');

// function handleResponse(serverResponse) {
//   console.log(serverResponse);
// }
// function handleError(serverError) {
//   console.log(serverError);
// }

const dialogflow = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = 'stock-trade-ee860') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'hey',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

bot.command('oldschool', (ctx) => {
  // client.textRequest('hey')
  //   .then(handleResponse)
  //   .catch(handleError);
  return ctx.reply('Hello');
});
bot.on('text', (ctx) => {
  runSample().then((message) => {
    console.log('message ----', message);
  }).catch((err) => {
    console.log(err);
  });
  console.log(ctx.update.message.text);
  return ctx.reply('Hello World')
});
bot.command('modern', ({ reply }) => reply('Yo'));
bot.command('hipster', Telegraf.reply('λ'));
bot.launch();