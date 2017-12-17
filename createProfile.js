import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  var params = {
    TableName: "profiles",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      profileId: uuid.v1(),
      birthday: "empty",
      gender: "empty",
      symptoms_active: "empty",
      symptoms_past: "empty",
      diagnosis_possible: "empty",
      diagnosis_active: "empty",
      diagnosis_past: "empty",
      medicaments_active: "empty",
      medicaments_past: "empty",
      hospitals: "empty",
      doctors: "empty",
      procedures: "empty",
      alternative_medicine: "empty",
      supplement: "empty",
      createdAt: new Date().getTime()
    }
  };

  for (var attr in data) {
    params.Item[attr] = data[attr];
  }

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
