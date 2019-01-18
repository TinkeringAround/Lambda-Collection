'use strict'

// required modules
var aws = require('aws-sdk');

// Lambda Instance
var lambda = new aws.Lambda({
  region: 'eu-central-1'
});

// s3 bucket instance
var s3 = new aws.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1'
});

// main Lambda Function handler
exports.handler = function (event, context) {
  
  var languages = event.locales;
  var uploads = [];

  for(let i=0; i < languages.length; i++) {

    var ContentfulEntry = JSON.stringify({
      entryid: event.entryid,
      language: languages[i]
    });

    var upload = new Promise((resolve, reject) => {
      resolve(uploadHTML(ContentfulEntry, event.path, languages[i], event.bucketName, event.lambdaName));
    });

    uploads.push(upload);
  }

  if(uploads.length > 0) {
    Promise.all(uploads).then(responses => {

      var response = {
        statusCode: 200,
        body: "Uploads successful!"
      };

      context.succeed(response);
    })
    .catch(error => {

      var response = {
        statusCode: 400,
        body: error
      };

      context.fail(response);
    });

  } else
  {
      var response = {
        statusCode: 400,
        body: "Upload failed. No Locales for the specific Entry can be resolved."
      };

    context.fail(response);
  }
};


async function uploadHTML(contentfulEntry, path, fileName, bucketName, lambdaName) {
  return new Promise(function(resolve, reject) {

    fetchHTML(contentfulEntry, lambdaName).then(data => {

      var html = JSON.parse(data.Payload);
      var fullPath = path + "/" + fileName + ".html";

      var params = {
        Body: html,
        Bucket: bucketName,
        Key: fullPath,
        ContentType: "text/html",
        ACL: "public-read"
      };

      s3.putObject(params, function(error, data) {
       if (error) {
         reject(error);
       }
       else {
         resolve(data);
       }
      });

    })
    .catch(error => {
      console.log(error);
      reject(error);
    });

  });
}


async function fetchHTML(contentfulEntry, lambdaName) {
  return new Promise(function(resolve, reject) {

    lambda.invoke({
      FunctionName: lambdaName,
      Payload: contentfulEntry
    }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
