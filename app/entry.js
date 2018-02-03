import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const tableName = "psn_entries";

export async function create(event, context, callback) {
  console.log(event);

  var params;
  var profile = null;
  var data;

  params = {
    TableName: 'psn_profiles',
    IndexName: "userId",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": event.requestContext.identity.cognitoIdentityId }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    if (result.Count >= 1) profile = result.Items[0];
  } catch (e) {
    callback(null, failure({ status: false }));
  }

  data = JSON.parse(event.body);

  params = {
    TableName: tableName,
    Item: {
      entryId: uuid.v1(),
      profileId: profile.profileId,
      message: data.message,
      attachments: data.attachments,
      createdAt: new Date().getTime(),
      postDate: data.postDate,
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function get(event, context, callback) {
  const params = {
    TableName: tableName,
    Key: {
      entryId: event.pathParameters.id
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
  console.log(event);

  var params;
  var profile = null;
  var data;

  params = {
    TableName: 'psn_profiles',
    IndexName: "userId",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": event.requestContext.identity.cognitoIdentityId }
  };

  try {
    var result = await dynamoDbLib.call("query", params);
    if (result.Count >= 1) profile = result.Items[0];
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }

  var params = {
    TableName: tableName,
    IndexName: "creationId",
    KeyConditionExpression: "profileId = :profileId",
    ExpressionAttributeValues: { ":profileId": profile.profileId },
    ScanIndexForward: false
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    callback(null, success(result.Items));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function remove(event, context, callback) {
  const params = {
    TableName: tableName,
    Key: {
      entryId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("delete", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function update(event, context, callback) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: {
      entryId: event.pathParameters.id
    },
    UpdateExpression: "SET postDate = :postDate, message = :message, attachments = :attachments",
    ExpressionAttributeValues: {
      ":attachments": data.attachments ? data.attachments : null,
      ":message": data.message ? data.message : null,
      ":postDate": data.postDate ? data.postDate : null,
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
