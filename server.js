const dotenv = require('dotenv');
dotenv.config();

// telegraf.js frame
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// dialog flow settings
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

// IBM watson analyze service
const getMessage = require('./service').getMessage;

// const projectId = 'bot-project-25638';

// Imports the Google Cloud client library.
// const {Storage} = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
// const storage = new Storage();

// Makes an authenticated API request.
// storage
//   .getBuckets()
//   .then((results) => {
//     const buckets = results[0];
//
//     console.log('Buckets:');
//     console.log(buckets);
//     buckets.forEach((bucket) => {
//       console.log(bucket.name);
//     });
//   })
//   .catch((err) => {
//     console.error('ERROR:', err);
//   });

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} queryText Text from bot
 */
async function runSample(queryText) {
  // A unique identifier for the given session
  const projectId = process.env.BOT_ID;
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
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
  return result.fulfillmentText;
}

bot.command('oldschool', (ctx) => ctx.reply('Hello Sloboda'));
bot.command('modern', ({ reply }) => reply('Yo'));
bot.command('hipster', Telegraf.reply('λ'));

bot.on('text', (ctx) => {
  const userMessage = ctx.update.message.text || '';

  // watson npl analyze
  getMessage(userMessage).then(output => {
    console.log(output);
  }).catch((err) => {
    console.log('Watson err:');
    console.log(err);
  });

  // google dialog flow AI answer
  runSample(userMessage).then((message) => {
    console.log('message ----', message);
    return ctx.reply(message)
  }).catch((err) => {
    console.log(err);
    return ctx.reply('Something went wrong')
  });
});

bot.launch();