import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";

const tableName = "psn_profiles";

export async function get(event, context, callback) {
  const params = {
    TableName: tableName,
    IndexName: "userId",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": event.requestContext.identity.cognitoIdentityId }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    console.log(result);
    if (result.Count < 1) callback(null, success(null));
    else callback(null, success(result.Items[0]));    
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  console.log(data);

  const params = {
    TableName: tableName,
    Item: {
      profileId: uuid.v1(),
      userId: event.requestContext.identity.cognitoIdentityId,
      createdAt: new Date().getTime()
    }
  };

  for (var attr in data) {
    params.Item[attr] = data[attr];
  }

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) { 
    console.log(e);
  }
  callback(null, success({ status: true }));
}

export async function update(event, context, callback) {
  var params = {
    TableName: tableName,
    IndexName: "userId",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": event.requestContext.identity.cognitoIdentityId }
  };

  var profile = null;

  try {
    var result = await dynamoDbLib.call("query", params);
    if (result.Count >= 1) profile = result.Items[0];
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }

  if (profile == null){
    callback(failure({ status: false }));   
    return; 
  }

  var data = JSON.parse(event.body);

  params = {
    TableName: tableName,
    Key: { profileId: profile.profileId },
    UpdateExpression: "SET",
    ExpressionAttributeValues: { },
    ReturnValues: "ALL_NEW"
  };

  for (var key in data) {
    if (key != 'profileId' && key != 'userId' && key != 'forwho'){
      params.UpdateExpression += " " + key + " = :" + key + ",";
      params.ExpressionAttributeValues[":" + key] = data[key];
    }
  }
  params.UpdateExpression = params.UpdateExpression.slice(0, -1);

  try {
    var result = await dynamoDbLib.call("update", params);
    callback(null, success(result));
  } catch (e) {
    callback(failure({ status: false }));
  }
}
