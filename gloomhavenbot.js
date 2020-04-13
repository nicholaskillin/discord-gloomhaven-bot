require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.GLOOMHAVEN_BOT_TOKEN

client.login(token);

client.on('message', message => {
  if(message.content.toLowerCase() === '!market') {
    message.channel.send(`You can access the parties market here ${process.env.MARKET_URL}`)
  } else if(message.content.toLowerCase() === 'marco') {
    message.channel.send(`polo`)
  }
});
