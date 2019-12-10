### Neat'n'sweet AWS Construct which creates Topic backed by Queue with a Lambda handler

Build the construct and echo handler
```bash
npm run build
```

Test the construct
```bash
npm run test
```

Embed the construct to your code with
```typescript
class TestStack extends Stack {
    constructor(scope: App, id: string = TestStack.name) {
      super(scope, id);

      const construct = new TopicQueueWithHandlerConstruct(this, {id});

      // Outputs
      new CfnOutput(this, 'QueueUrl', {value: construct.queueUrl});
      new CfnOutput(this, 'QueueHandlerName', {value: construct.queueHandlerName});
      new CfnOutput(this, 'TopicArn', {value: construct.topicArn});
    }
  }
```
