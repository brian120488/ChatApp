import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  const { connectionId } = event.requestContext;

  await ddb.send(
    new PutItemCommand({
      TableName: "Connections",
      Item: {
        connectionId: { S: connectionId },
      },
    })
  );

  return { statusCode: 200 };
};
