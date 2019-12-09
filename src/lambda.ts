import 'source-map-support/register';
import {withSQSEventHandler} from "./sqsEventHandler";

export const echoSQSEventHandler = withSQSEventHandler((body) => {
  console.log(`processing message body ${JSON.stringify(body)}`);
});


