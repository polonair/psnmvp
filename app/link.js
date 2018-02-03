import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const tableName = "psn_links";

export async function create(event, context, callback) {
  var params = {
    TableName: "psn_profiles",
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
    Item: {
      linkId: uuid.v1(),
      profileId: profile.profileId,
      duration: data.duration,
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
  var result;  
  var params = {
    TableName: tableName,
    Key: {linkId: event.pathParameters.id}
  };

  try {
    result = await dynamoDbLib.call("get", params);
    if (!result.Item) {
      callback(null, failure({ status: false, error: "Item not found." }));
      return;
    }
  } catch (e) {
    callback(null, failure({ status: false }));
    return;
  }

  params = {
    TableName: "psn_profiles",
    Key: { 
      profileId: result.Item.profileId
    }
  };

  try {
    var result2 = await dynamoDbLib.call("get", params);
    var expiredAt = result.Item.createdAt + result.Item.duration;
    var now = new Date().getTime();
    if ((now < expiredAt) || (result.Item.duration == 0))
    {
      result2.Item.userId = null;
      result2.Item.profileId = null;
      callback(null, success(result2.Item));
    } else {
      callback(null, failure({ status: false, error: "Item not found." }));
    }

    if (result.Item) callback(null, success(result.Item));
    else callback(null, failure({ status: false, error: "Item not found." }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}

export async function list(event, context, callback) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "profileId = :profileId",
    ExpressionAttributeValues: {
      ":profileId": event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
