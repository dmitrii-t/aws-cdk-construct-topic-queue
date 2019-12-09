import 'source-map-support/register';
import {SQSEvent, SQSRecord} from 'aws-lambda';
import {Message} from "./Message";

export async function handleSQSEvent(event: SQSEvent) {
  console.log(`Handled SQS Event ${JSON.stringify(event)}`);

  // Processing messages in async manier
  await Promise.all(event.Records.map(message => {
    try {
      handleMessage(message);

    } catch (e) {
      console.error(`Fail to process parsed msg ${message.messageId}`, e);
    }
  }));
};

async function handleMessage(sqsMessage: SQSRecord) {
  console.info(`parsing sqs message ${JSON.stringify(sqsMessage)}`);
  const message: Message = JSON.parse(sqsMessage.body);
  console.log(`processing message ${JSON.stringify(message)}`);
}

