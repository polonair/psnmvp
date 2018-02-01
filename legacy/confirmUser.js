export function main(event, context, callback) {
  const modifiedEvent = event;
  
  if (event.triggerSource === "PreSignUp_SignUp"){
    modifiedEvent.response.autoConfirmUser = true;
    callback(null, modifiedEvent);
    return;
  }
  callback(`Misconfigured Cognito Trigger ${ event.triggerSource }`);
};
