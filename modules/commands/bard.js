const axios = require('axios');

module.exports.config = {
  name: "bard",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rony",
  description: "Interact with Bardai AI",
  usages: `!bard \${prefix}bard [question]`,
  group: "AI",
  cooldowns: 5,
  dependencies: {
    "axios": "",
  }
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(' ');

  try {
    const response = await axios.get(`https://bardai-cxjq.onrender.com/bard/?ask=${encodeURIComponent(question)}`);

    if (response.data && response.data.result) {
      // Send the result text
      api.sendMessage(response.data.result, event.threadID);
    } else {
      api.sendMessage("Oops! Something went wrong with Bardai AI.", event.threadID);
    }
  } catch (error) {
    console.error("Error interacting with Bardai AI:", error);
    api.sendMessage("Oops! Something went wrong while contacting Bardai AI.", event.threadID);
  }
};
