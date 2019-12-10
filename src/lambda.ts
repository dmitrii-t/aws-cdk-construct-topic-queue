import 'source-map-support/register';

import {Body} from "./Body";
import {SQSEvent} from "aws-lambda";

export function withSQSEventHandler(bodyHandler: (body: Body) => void) {
  return async (event: SQSEvent) => {
    console.log(`Handled SQS Event ${JSON.stringify(event)}`);

    // Processing messages in async manier
    await Promise.all(event.Records.map(sqsRecord => {
      try {
        console.info(`parsing sqs message ${JSON.stringify(sqsRecord)}`);
        const body: Body = JSON.parse(sqsRecord.body);
        bodyHandler(body);

      } catch (e) {
        console.error(`Fail to process parsed msg ${sqsRecord.messageId}`, e);
      }
    }));
  };
}

export const echoSQSEventHandler = withSQSEventHandler((body) => {
  console.log(`processing message body ${JSON.stringify(body)}`);
});


