'use strict'

// modules
const fs = require("fs");
const contentful = require('contentful');
const renderEngine = require('render/renderEngine.js');

// read credentials from config file
const content = fs.readFileSync("config.json");
const contentfulCredentials = JSON.parse(content);

// Contentful Access Token
const SPACE_ID = contentfulCredentials.SPACE_ID;
const ACCESS_TOKEN = contentfulCredentials.ACCESS_TOKEN;

// Connect to Contentful Preview API
const client = contentful.createClient({
   space: SPACE_ID,
   accessToken: ACCESS_TOKEN,
   host: 'preview.contentful.com'
});

// lambda handler function
exports.handler = function (event, context) {

  client.getEntry(event.entryid, {
    language: event.language
  }).then(entry => {

    var title = entry.fields['name'];
    var releaseNoteSections = [];

    for(let i=0; i < entry.fields['sections'].length; i++) {
      var releaseNoteSectionPromise = new Promise( (resolve, reject) => {
        resolve(fetchSection(entry.fields['sections'][i].sys.id, event.language));
      });
      releaseNoteSections.push(releaseNoteSectionPromise);
    }

    Promise.all(releaseNoteSections).then(sections => {

      if(sections.length > 0) {
        var assetOfSection = [];
        var sectionsWithAssets = [];
        var index = 0;

        for(let i=0; i<sections.length; i++) {

          var section = {
            header: sections[i].fields['header'],
            content: sections[i].fields['content'],
            type: sections[i].sys.contentType.sys.id,
          };

          if(sections[i].sys.contentType.sys.id == 'Text-Bild-Block' || sections[i].sys.contentType.sys.id == 'Text-Video-Block') {
            section.assetURL = index;
            index++;
            var assetPromise = new Promise( (resolve, reject) => {
              resolve(fetchAsset(sections[i].fields['asset'].sys.id, event.language));
            });
            assetOfSection.push(assetPromise);
          }

          sectionsWithAssets.push(section);
        }

        Promise.all(assetOfSection).then(assets => {
          var html = renderEngine.renderHTML(mapAssetsToSections(sectionsWithAssets, assets), title);
          context.succeed(html);
        });
      }

    });
    
  })
  .catch(error => {
    console.error(error);
    context.fail(error);
  });
};


async function fetchSection(id, language) {
  return new Promise(function(resolve, reject) {

    client.getEntry(id, {
      locale: language,
      include: 2
    })
    .then((section) => resolve(section))
    .catch( (error) => {
      console.error(error);
      reject(error);
    });
  });
}

async function fetchAsset(assetid, language) {
  return new Promise(function(resolve, reject) {

    client.getAsset(assetid, {
      language: language
    })
    .then((asset) => {
      resolve(asset);
    })
    .catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

function mapAssetsToSections(sections, assets) {
  for(let i=0; i<sections.length; i++) {
    if(sections[i].hasOwnProperty('assetURL')) {
      var url = assets[sections[i].assetURL].fields['file']['url'];
      sections[i].assetURL = 'https:' + url;
    }
  }

  return sections;
}
