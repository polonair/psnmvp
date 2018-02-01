import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const modifiedEvent = event;

  const params = {
    TableName: "profiles",
    Item: {
      userId: event.userName,
      profileId: uuid.v1(),
      content: "empty",
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) { }
  callback(null, modifiedEvent);
}
