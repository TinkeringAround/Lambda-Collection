# Contentful To HTML In S3
AWS Lambda Node.js Function for fetching Contentful data thorugh another Lambda Function to store static HTML files in AWS S3 bucket.
This Project is a simple PoC/Demo for testing render capabilities of AWS Lambda Functions and AWS S3 SDK.

This Lambda Function will fetch HTML data from another Lambda Function, which renders HTML files by accessing Contentful, in both german and english language. Plus, it then access a S3 bucket and uploads these files.

I used the Inline Lambda Editor due to little code, so I did not need any node modules to import. All the AWS SDK functionalities like S3 access or lambda invocation are imported by default.

*Runtime: Node.js 8.1 running on AWS Lambda free tier.*

## Warning!
This Project is PoC/Demo only! You can fork this Repo and use it for testing purposes. For Production environment include proper testing & CI/CD and deployment files for AWS.

## Parameters
1. Contentful File ID as EntryID
2. Contentful File Name as Path for storing in a S3 folder with this path
3. locales as the languages to translate to
4. S3 Bucket as Parameter bucketName
5. Lambda Function which return HTML files

<pre>
<code>
{
  "entryid": "{ /payload/sys/id}",
  "path": "{ /payload/fields/name/de-DE}",
  "locales": [
    "de-DE",
    "en-GB"
  ],
  "bucketName": "oru-releasenotes-poc",
  "lambdaName": "ORU-Preview-Lambda"
}
</code>
</pre>


## Contentful SDK
In this example I use the original Contentful SDK for accessing and retrieving JSON Data and render them into an HTML site.

[Official Documentations](https://contentful.github.io/contentful.js/contentful/7.0.5/index.html)
&
[Check out their GitHub Page](https://github.com/contentful/contentful.js)
