import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  var params = {
    TableName: "profiles",
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      profileId: event.pathParameters.id
    },
    UpdateExpression: "SET",
    ExpressionAttributeValues: { },
    ReturnValues: "ALL_NEW"
  };
  
  for (var key in data) {
    params.UpdateExpression += " " + key + " = :" + key;
    params.ExpressionAttributeValues[":" + key] = data[key];
  }

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
