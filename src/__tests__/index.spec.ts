// Integration test
import {TopicQueueWithHandlerConstruct} from '../index';

import {App, CfnOutput, Stack} from '@aws-cdk/core';
import {OutputLogEvent, OutputLogEvents} from 'aws-sdk/clients/cloudwatchlogs';
import {expect} from 'chai';
import * as path from 'path';
import {deployStack, destroyStack, withStack} from 'cdk-util';
import * as AWS from 'aws-sdk';
import {getLogEventInGroup} from "./aws-util";
import {Body} from "../Body";

/**
 * CDK output directory
 */
const CdkOut = path.resolve('cdk.out');

describe('given cdk stack which creates a topic backed by queue with echo handler', () => {
  /**
   * Stack to deploy the construct for tests
   */
  class TestStack extends Stack {
    constructor(scope: App, id: string) {
      super(scope, id);

      const construct = new TopicQueueWithHandlerConstruct(this, {id});

      // Outputs
      new CfnOutput(this, 'QueueUrl', {value: construct.queueUrl});
      new CfnOutput(this, 'QueueHandlerName', {value: construct.queueHandlerName});
      new CfnOutput(this, 'TopicArn', {value: construct.topicArn});
    }
  }

  const id = 'TestTopicQueueWithHandler';
  const app = new App({outdir: CdkOut});
  const stack = new TestStack(app, id);

  // Setup task
  before(async () => {
    await deployStack({name: id, app, exclusively: true});
  });

  // Cleanup task
  after(async () => {
    await destroyStack({name: id, app, exclusively: true});
  });

  it('should process the message sent to the topic', withStack({name: id, app, exclusively: true}, async ({environment, stack}) => {
    // Given
    const queueHandlerName = stack.Outputs!!.find(it => it.OutputKey === 'QueueHandlerName')!!.OutputValue;
    const topicArn = stack.Outputs!!.find(it => it.OutputKey === 'TopicArn')!!.OutputValue;

    AWS.config.update({region: 'us-west-2'});
    const snsClient = new AWS.SNS();
    const cwLogsClient = new AWS.CloudWatchLogs();

    // When
    const message: Body = {};
    const messageStr = JSON.stringify(message);
    await snsClient.publish({
      TopicArn: topicArn, Message: messageStr
    }).promise();

    // Wait for log record to appear
    await wait(20);

    // Then
    const queueHandlerLogEvents: OutputLogEvents = await getLogEventInGroup({
      logGroupPrefix: `/aws/lambda/${queueHandlerName}`,
      cwLogsClient
    });

    console.log(`Log Events: \n${JSON.stringify(queueHandlerLogEvents)}`);

    const queueHandlerLogEvent: OutputLogEvent | undefined = queueHandlerLogEvents.find(it => it.message!!.indexOf('Handled SQS Event') > 0);
    expect(queueHandlerLogEvent).to.exist;

    // Return completed promise
    return Promise.resolve();
  }));
});

async function wait(sec: number) {
  const startTime = new Date().getTime();
  await new Promise((resolve, reject) => {
    setTimeout(resolve, sec * 1000);
  });
  console.info(`Waited for ${(new Date().getTime() - startTime) / 1000.0}sec`);
}
