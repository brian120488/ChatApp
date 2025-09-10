import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;

  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${domain}/${stage}/`,
    region: "us-east-2",
  });

  const { Items } = await ddb.send(new ScanCommand({ TableName: "Connections" }));

  const message = JSON.stringify({
    message: JSON.parse(event.body).data,
  });

  await Promise.all(
    Items.map(async (item) => {
      const targetConnectionId = item.connectionId.S;
      try {
        // if (targetConnectionId === connectionId) return;
        await client.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: message,
          })
        );
      } catch (err) {
        if (err.name === "GoneException") {
          // remove stale connections
          await ddb.send(
            new DeleteItemCommand({
              TableName: "Connections",
              Key: { connectionId: { S: connectionId } },
            })
          );
        } else {
          console.error("Error posting to connection:", err);
        }
      }
    })
  );

  return { statusCode: 200 };
};
