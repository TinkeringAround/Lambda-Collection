# Contentful To HTML
AWS Lambda Node.js Function for fetching Contentful data to render it as static HTML file.
This Project is a simple PoC/Demo for testing render capabilities of AWS Lambda Functions and Contentful SDK.

*Runtime: Node.js 8.1 running on AWS Lambda free tier.*

## Warning!
This Project is PoC/Demo only! You can fork this Repo and use it for testing purposes. For Production environment include proper testing & CI/CD and deployment files for AWS.

## Parameters
1. **Configuration File**
The Lambda Function requires a "config.json" file which stores Contentful Space ID and Access Token. In this example the Contentful Preview API is used for fetiching unpublished data.

 2. **Optional: Style sheet**
In "renderEngine.js" there is a placeholder for a custom Stylesheet URL which can be added in the HTML files.

 3. **Query Parameters**
This function is meant to be called per GET through API Gateway which checks the request for two query parameters, "entryID" and "language". "EntryID" is the intern Contentful file ID, "language" defines the output language of the rendered HTML file. The Lambda Function will fetch the Contentful file in this selected language.

## Contentful SDK
In this example I use the original Contentful SDK for accessing and retrieving JSON Data and render them into an HTML site.

[Official Documentations](https://contentful.github.io/contentful.js/contentful/7.0.5/index.html)
&
[Check out their GitHub Page](https://github.com/contentful/contentful.js)
