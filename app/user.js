import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function confirm(event, context, callback) {
  const modifiedEvent = event;
  
  if (event.triggerSource === "PreSignUp_SignUp"){
    modifiedEvent.response.autoConfirmUser = true;
    callback(null, modifiedEvent);
    return;
  }
  callback(`Misconfigured Cognito Trigger ${ event.triggerSource }`);
}

export async function postConfirm(event, context, callback) {
  const modifiedEvent = event;

  const params = {
    TableName: "psn_profiles",
    Item: {
      profileId: uuid.v1(),
      userId: event.userName,
      isEmpty: true,
      createdAt: new Date().getTime()
    }
  };

  try {
    //await dynamoDbLib.call("put", params);
  } catch (e) { 
    console.log(e);
  }
  callback(null, modifiedEvent);
}
