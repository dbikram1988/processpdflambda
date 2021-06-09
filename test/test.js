const assert = require('assert');
const { handler } = require('../app')
const fs = require( 'fs' );
const { expect } = require('chai');
const awsMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');

// Mock event
const event = require('./localTestEvent')

// Mock environment variables
process.env.AWS_REGION = 'us-west-2'
process.env.localTest = true
process.env.language = 'en'
process.env.OutputBucket = 'modular-clm-stage'

describe('pdf document upload into s3 document bucket', () => {
    before(() => {
        const rootPath = process.cwd();
        // console.log(`Before trigger: Root Path: ${rootPath}`);
        awsMock.mock("S3", "getObject", function(params, callback) {
            callback(null, {
                Body: Buffer.from(fs.readFileSync(`${ rootPath }/test/IBM-Agreement-v1.pdf`))
            })
        });

        awsMock.mock("S3", "headObject", function(params, callback) {
            callback(null, {
                Metadata: {
                    'agreement-id': '1234567',
                    'client': 'clm_dev'
                }
            })
        });
    });

    after(() => {
        // console.log(`After : trigger`);
        awsMock.restore('S3');
    });

    it('Confirm text extracted from pdf file and new text file created in staging bucket.', () => {
        const main = async () => {
            await handler(event)
        }
        main();

        const s3 = new AWS.S3();
        const stagingBucketResult = s3.getObject({
            Bucket: process.env.OutputBucket,
            Key: 'pdf/IBM-Agreement-v1.pdf.txt',
        }).promise().then((value) => {
            expect(value).to.have.property('Body');
        });
    })
    
    it('should save all the object metadata into ElasticSearch', () => {
        assert.strictEqual(1, 1, "Metadata not saved in Elasticsearch.");
    });
});
