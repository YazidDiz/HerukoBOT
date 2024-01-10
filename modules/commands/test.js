module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SenProject",
  description: "Test Command",
  usages: "",
  group: "TEST",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID } = event;

  // Fetch the user's information
  const userInfo = (await Users.getInfo(senderID)) || {};

  // Get the user's name
  const userName = userInfo.name || 'User';

  // Your custom response message
  const replyMessage = `Hi, this is the Test command! Thank you, ${userName}, for using it.`;

  // Send the message
  return api.sendMessage(replyMessage, event.threadID);
};
