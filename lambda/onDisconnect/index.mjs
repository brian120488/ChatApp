import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  const { connectionId } = event.requestContext;

  await ddb.send(
    new DeleteItemCommand({
      TableName: "Connections",
      Key: {
        connectionId: { S: connectionId },
      },
    })
  );

  return { statusCode: 200 };
};