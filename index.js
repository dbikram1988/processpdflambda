'use strict'

const pdf = require('pdf-parse')
const { createDocument } = require('./ESService')

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION

// The standard Lambda handler
exports.handler = async (event) => {

  console.log(JSON.stringify(event, null, 2))

  // Handle each incoming S3 object in the event
  await Promise.all(
   event.Records.map(async (event) => {
     try {
       await processDocument(event)
     } catch (err) {
       console.error(`Handler error: ${err}`)
     }
   })
  )
}

// Document Process Handler
const processDocument = async (event) => {
  const s3 = new AWS.S3()

  // Get object info
  const Bucket = event.s3.bucket.name
  const Key = decodeURIComponent(event.s3.object.key.replace(/\+/g, ' '))
  console.log(`Bucket: ${Bucket}, Key: ${Key}`)

  // Get meta data from S3 object
  const metaData = await s3.headObject({ Bucket, Key }).promise();
  const Metadata = metaData.Metadata

  // If any meta data present in the uploaded s3 object then pass it to next process
  if(Metadata == null || Metadata == undefined)
    Metadata = {}

  // Adding an additional metadata for object url
  Metadata['doc_key'] = Key;
  
  // Created date in GMT format
  Metadata['created_date'] = new Date().toISOString();

  // Get file name from Key
  key_split = Key.split("/");
  Metadata['file_display_name'] = key_split[key_split.length - 1];


  try {

    // Get content from source S3 object
    const result = await s3.getObject({
      Bucket,
      Key
    }).promise()
    console.log(result);

    // Extract text from PDF
    const data = await pdf(result.Body)
    console.log('PDF text length: ', data.text.length)

    // Write result to staging S3 bucket
    await s3.putObject({
      Bucket: process.env.OutputBucket,
      Key: `pdf/${Key}.txt`,
      Body: data.text,
      ContentType: 'application/text',
      Metadata: Metadata
    }).promise();

  } catch (err) {
    console.error(`Handler error: ${err}`)
  }
}
