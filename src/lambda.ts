import 'source-map-support/register';
import {SQSEvent} from 'aws-lambda';
import {Body} from "./Body";

export async function handleSQSEvent(event: SQSEvent) {
  console.log(`Handled SQS Event ${JSON.stringify(event)}`);

  // Processing messages in async manier
  await Promise.all(event.Records.map(sqsRecord => {
    try {
      console.info(`parsing sqs message ${JSON.stringify(sqsRecord)}`);
      const body: Body = JSON.parse(sqsRecord.body);
      handleBody(body);

    } catch (e) {
      console.error(`Fail to process parsed msg ${sqsRecord.messageId}`, e);
    }
  }));
};

async function handleBody(body: Body) {
  console.log(`processing message body ${JSON.stringify(body)}`);
  //TODO extension point
}

