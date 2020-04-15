require('dotenv').config({path: '/home/pi/Desktop/gloomhavenBot/.env'})
require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.GLOOMHAVEN_BOT_TOKEN
const publicIp = require('public-ip');

client.login(token);

client.on('ready', () => {
  client.user.setPresence({activity: {name: '"!help" for help'}, status: "online"});
});

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
  } else if(message.content.toLowerCase() === '!help') {
    message.channel.send('Here is a list of the things you can ask me:\n\n"!nextsession" or "!whattime": This will tell you when our next Gloomhaven Online session starts.\n\n"!market": This will give you the URL to our parties online town market\n\n"!helpersettings": This will give you the current ip address and port to use in Gloomhaven Helper.\n\n"!mycards": This will give you the URL for the app we use to manage our ability at attack modifier cards during the campaign.')
  } else if(message.content.toLowerCase() === '!mycards') {
    message.channel.send(" You can use the Gloomhaven Card Manager to manage your character's ability and attack modifier cards during the campaign.\nhttps://nicholaskillin.github.io/.")
  } else if(message.content.toLowerCase() === '!nextsession' || message.content.toLowerCase() === '!whattime') {
    getNextSession(message);
  } else if(message.content.toLowerCase().includes('!scenariogoals')){
    players = [...message.mentions.users]
    if(players.length < 2) {
      message.channel.send(`You need to mention at least 2 people in your message.`)
    } else if(players.length > 6){
      message.channel.send(`You can only have a max of 6 players mentioned.`)
    } else {
      sendScenarioGoals(message, players);
    }
  } else if(message.content.toLowerCase() === '!gbstats' && message.author.username === process.env.MY_USERNAME){
    message.author.send(`Here are the stats for Gloomhaven Bot 2.0.\n\nNumber of Servers: ${client.guilds.cache.size}`)
  }
});

function sendScenarioGoals(message, players) {
  //Get URL
  users = new Array(message.mentions.users);
  let seedNumber = Math.floor((Math.random() *   8000) + 1);
  let playerNumber = 1;

  message.mentions.users.forEach(user => {
    var url = `http://rastrillo.synology.me:3838/?_inputs_&Player=${playerNumber}&Seed=${seedNumber}&Extended=false&NumCards=2&button=1`
    user.send(`Here are your scenario goals:\n${url}`)
    playerNumber ++;
  })
};

// Calendar Stuff

function getNextSession(message) {
  // Get events from Google Calendar
  const fs = require('fs');
  const readline = require('readline');
  const {google} = require('googleapis');

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH;

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        const start = events[0].start.dateTime || events[0].start.date;
        postNextSession(message, start);
      } else {
        postNextSession(message, "no events")
      }
    });
  }
};

function postNextSession (message, event) {
  if (event === "no events") {
    message.channel.send(`We don't have any sessions scheduled right now.`)
  } else {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let eventStart = new Date(event)
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    
    const isToday = (someDate) => {
      const today = new Date()
      return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    }
    var timeString = eventStart.toLocaleString('en-US', options);

    if(isToday(eventStart)) {
      message.channel.send(`We are playing today at ${timeString}.`)
    } else {
      message.channel.send(`We are playing on ${days[eventStart.getDay()]} ${eventStart.getMonth()}/${eventStart.getDate()} at ${timeString}.`)
    }
  }
}
