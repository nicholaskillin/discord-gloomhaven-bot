require('dotenv').config({path: '/home/pi/Desktop/gloomhavenBot/.env'})
require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.GLOOMHAVEN_BOT_TOKEN
const publicIp = require('public-ip');

client.login(token);

client.on('message', message => {
  if(message.content.toLowerCase() === '!market') {
    message.channel.send(`You can access the parties market here\n${process.env.MARKET_URL}`)
  } else if(message.content.toLowerCase().includes('marco')) {
    message.channel.send(`polo`)
  } else if(message.content.toLowerCase() === '!helpersettings') {
    let publicIpAddress = (async () => {
      return await publicIp.v4();
    })();
    publicIpAddress.then(function(address) {
      message.channel.send(`Address: ${address}\nPort: 58888`);
    })
  } else if(message.content.toLocaleLowerCase() === '!help') {
    message.channel.send('Here is a list of the things you can ask me:\n\n"!market": This will give you the URL to our parties online town market\n"!helpersettings": This will give you the current ip address and port to use in Gloomhaven Helper.')
  }
});
