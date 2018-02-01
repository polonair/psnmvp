import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const params1 = {
    TableName: "links3",
    Key: { linkId: event.pathParameters.id }
  };

  try {
    const result = await dynamoDbLib.call("get", params1);
    if (result.Item) {
      const params2 = {
        TableName: "profiles",
        Key: {
          userId: result.Item.userId,
          profileId: result.Item.profileId
        }
      };
      const result2 = await dynamoDbLib.call("get", params2);
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
    } else {
      callback(null, failure({ status: false, error: "Item not found." }));
    }
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
