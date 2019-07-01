// watson-service.js
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY || '<iam_apikey>',
  // iam_url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
  // username: process.env.WATSON_USERNAME,
  // password: process.env.WATSON_PASSWORD,
  url:      process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
  version:  process.env.WATSON_VERSION
});

exports.getMessage = message =>
  new Promise((resolve, reject) => {
    nlu.analyze(
      {
        html: message, // Buffer or String
        features: {
          concepts: {},
          keywords: {}
        }
      })
      .then(result => {
        console.log(JSON.stringify(result, null, 2));
        resolve(result)
      })
      .catch(err => {
        console.log('message watson error =====>');
        console.log('error:', err);
        reject(err);
      });
  });
