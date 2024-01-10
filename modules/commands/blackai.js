const axios = require('axios');

module.exports.config = {
  name: "heruko",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rony",
  description: "Interact with an AI",
  usages: `!ai \${prefix}ai [question]`,
  group: "AI",
  cooldowns: 5,
};


module.exports.run = async function({ api, event, args }) {
  const question = args.join(' ');

  try {
    const response = await axios.get(`https://redapi-kpdc.onrender.com/blackai?question=${encodeURIComponent(question)}`);
    if (response.data && response.data.message) {
      api.sendMessage(response.data.message, event.threadID);
    } else {
      api.sendMessage("Oops! Something went wrong with the AI.", event.threadID);
    }
  } catch (error) {
    console.error("Error interacting with AI:", error);
    api.sendMessage("Oops! Something went wrong while contacting the AI.", event.threadID);
  }
};