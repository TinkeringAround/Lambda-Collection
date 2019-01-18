'use strict';

// modules
const fs = require("fs");
const contentful = require('contentful');
const axios = require('axios');

// read credentials from config file
const config = fs.readFileSync("config.json");
const CREDENTIALS = JSON.parse(config);

// Connect to Contentful Preview API
const client = contentful.createClient({
   space: CREDENTIALS.CF_SPACE_ID,
   accessToken: CREDENTIALS.CF_ACCESS_TOKEN,
   host: 'preview.contentful.com'
});


// lambda handler function
exports.handler = function (event, context) {
  client.getEntry(event.entryID)
  .then(entry => {
    // variables
    var title = entry.fields['name'];
    var md = entry.fields['content'].md;

    var keys = [];
    extractKeysFrom(md, keys);

    //this is the call
    let url = "https://api.phraseapp.com/api/v2/projects/" + event.projectID + "/locales/" + event.localeID + "/download?file_format=json";
    
    axios.get(url, { headers: {"Authorization" : 'Basic ' + new Buffer(CREDENTIALS.PA_API_KEY).toString('base64')} }).then((response) => {
      var translation = response.data;
      
      for(let i=0; i<keys.length; i++) {
        md = md.replace("[" + keys[i] + "]", translation[keys[i]].message);  
      }
      
      context.succeed(md);
    });
  }).catch( error => {
    console.error(error);
    context.fail(error);
  });
};


function extractKeysFrom(text, keys) {
  for(let i=0; i<text.length; i++) {
  	var key = "";
    if(text.charAt(i) == "[") { 
      for(let n=i+1; n<text.length; n++) {
        if(text.charAt(n) == "]") {
          keys.push(key);
          break;
        } else {
        	key += text.charAt(n);
        }
      }
    }
  }
}