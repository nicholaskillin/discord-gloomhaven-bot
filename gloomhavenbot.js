const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'Njk4OTQ5MjM0OTIxMDQ2MDk2.XpNT4w.ZjxZA3n4J93HzduR55ZPuHzgj_g'

client.login(token);

client.on('message', message => {
  if(message.content.toLowerCase() === '!market') {
    message.channel.send(`You can access the parties market here https://heisch.github.io/gloomhaven-item-db/#eyJhbGwiOmZhbHNlLCJwcm9zcGVyaXR5IjozLCJpdGVtIjpbXSwiaXRlbXNJblVzZSI6eyIyIjoxLCI3IjoxLCIxMyI6MSwiMTUwIjoxfSwic29sb0NsYXNzIjpbIlNLIiwiQlQiXSwiZGlzY291bnQiOi0zLCJkaXNwbGF5QXMiOiJpbWFnZXMiLCJsb2NrU3BvaWxlclBhbmVsIjpmYWxzZSwiZW5hYmxlU3RvcmVTdG9ja01hbmFnZW1lbnQiOnRydWV9 `)
  } else if(message.content.toLowerCase() === 'marco') {
    message.channel.send(`polo`)
  }
});
