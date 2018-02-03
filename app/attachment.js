import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const tableName = "psn_attachments";

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: {
      attachmentId: uuid.v1(),
      entryId: data.entryId,
      profileId: data.profileId,
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function get(event, context, callback) {
  const params = {
    TableName: tableName,
    Key: {
      attachmentId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) callback(null, success(result.Item));
    else callback(null, failure({ status: false, error: "Item not found." }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function list(event, context, callback) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "entryId = :entryId",
    ExpressionAttributeValues: {
      ":entryId": event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function remove(event, context, callback) {
  const params = {
    TableName: tableName,
    Key: {
      attachmentId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("delete", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
