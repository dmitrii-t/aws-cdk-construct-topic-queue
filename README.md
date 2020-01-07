### Neat'n'sweet AWS Construct which creates Topic backed by Queue with a Lambda handler

Install the project locally
```
git clone https://github.com/theotherdmitrii/aws-cdk-construct-topic-queue.git
npm install
```

Build the construct and echo handler
```bash
npm run build
```

Create local `.env` file with AWS credentials for your deployment account
```
cat > .env.json <<EOF
{
    "AWS_ACCESS_KEY_ID": "<provide your access key id>",
    "AWS_SECRET_ACCESS_KEY": "<privide your scret key>",
    "AWS_DEFAULT_REGION": "<specify default region to deploy>"
}
EOF
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
