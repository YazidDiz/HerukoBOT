const fs = require('fs-extra');
const pathFile = __dirname + '/cache/txt/autoseen.txt';

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SenProject",
  description: "autoseen",
  group: "general",
  usages: "[autoseen on/off]",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event, args }) => {
  if (!fs.existsSync(pathFile))
    fs.writeFileSync(pathFile, 'false');

  const isEnable = fs.readFileSync(pathFile, 'utf-8');

  if (isEnable == 'true')
    api.markAsReadAll(() => {});
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] == 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage('The autoseen function is now enabled for new messages.', event.threadID, event.messageID);
    } else if (args[0] == 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage('The autoseen function has been disabled for new messages.', event.threadID, event.messageID);
    } else {
      api.sendMessage('Incorrect syntax. Use `on` or `off`.', event.threadID, event.messageID);
    }
  } catch (e) {
    console.error(e);
  }
};
