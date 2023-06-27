const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require("dotenv").config();

const token =process.env.token;
const bot = new TelegramBot(token, {polling: true});

bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;

  // Send a welcome message when the bot joins a new group
  if(msg.from.last_name){
    bot.sendMessage(chatId, `hi ${msg.from.last_name} welcome to our group`);
  }else if(msg.from.first_name){
    bot.sendMessage(chatId, `hi ${msg.from.first_name} welcome to our group`);
  }else{
    bot.sendMessage(chatId, `hi ${msg.from.username} welcome to our group`);
  }
});



bot.on('message', async (msg) => {
    console.log(msg)
    articleTitle=msg.text
    const chatId = msg.chat.id;
  if(articleTitle){
    try {
      const summaryResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(articleTitle)}&format=json`
      );
      const pages = summaryResponse.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const summary = pages[pageId].extract;
      console.log(summary)
      // Post the article and summary to Telegram
      const message = `Wikipedia Article:\n\nTitle: ${articleTitle}\n\nSummary: ${summary}`;
      bot.sendMessage(chatId,message);
    } 
     catch (error) {
       console.log(error.message)
    }
  }
    
  
  });

;


