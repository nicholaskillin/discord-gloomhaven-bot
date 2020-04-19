require('dotenv').config({path: '/home/pi/Desktop/gloomhavenBot/.env'})
require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.GLOOMHAVEN_BOT_TOKEN
const publicIp = require('public-ip');
const fs = require('fs');

client.login(token);



client.on('ready', () => {
  client.user.setPresence({activity: {name: '"!help" for help'}, status: "online"});
});

client.on('message', message => {
  if(message.content.toLowerCase() === '!market') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data);
      message.channel.send(`You can access the parties market here\n${obj.market}`);
    });
  } else if(message.content.toLowerCase() === '!scenarios') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data);
      message.channel.send(`You can access the parties storyline here\n${obj.scenarios}`);
    });
  }else if(message.content.toLowerCase().includes('marco')) {
    message.channel.send(`polo`)
  } else if(message.content.toLowerCase() === '!helpersettings') {
    let publicIpAddress = (async () => {
      return await publicIp.v4();
    })();
    publicIpAddress.then(function(address) {
      message.channel.send(`Address: ${address}\nPort: 58888`);
    })
  } else if(message.content.toLowerCase() === '!help') {
    const embed = new Discord.MessageEmbed()
    .setTitle('Gloomhaven Bot Help')
    .setDescription('Here is a list of the things you can ask me:\n\n**!nextsession** or **!whattime**: This will tell you when our next Gloomhaven Online session starts.\n\n**!market**: This will give you the URL to our parties online town market.\n\n**!setmarketurl**: If you make a change to the market then we will need a new link to see your changes. You can click on the "Share" tab at the top of the market, then click on "Copy". This command should look something like:\n\n `!setmarketurl copied_url_here`\n\n**!scenarios**: This will give you the URL to our parties updated campaign status in a way that makes it easier to visualize the storyline.\n\n**!setscenariourl**: If you make a change to the scnario map then we will need a new link to see your changes. You can click on the Menu button in the top left of the window, then click on "Share", then click on "Copy the link". This command should look something like:\n\n `!setscenariourl copied_url_here`\n\n**!mycards**: This will give you the URL for an app you can use to manage your ability and attack modifier cards during the campaign.\n\n**!helpersettings**: This will give you the current ip address and port to use in Gloomhaven Helper.')
    message.channel.send(embed)
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
  } else if(message.content.toLowerCase().startsWith('!setmarketurl')) {
    const prefix = "!setmarketurl";
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1);
      const obj = JSON.parse(data);
      obj.market = newUrl;
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date();
        var dataForLog = `${dateTime} - ${obj.market}\n`;
        console.log(dataForLog);
        fs.appendFile(process.env.MARKET_LOG, dataForLog, (err) => {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
        err ? message.channel.send(`${err}`) : message.channel.send(`You updated the market URL.`);
      });
    });
  } else if(message.content.toLowerCase().startsWith('!setscenariourl')) {
    const prefix = "!setscenariourl";
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1);
      const obj = JSON.parse(data);
      obj.scenarios = newUrl;
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date();
        console.log(message);
        var dataForLog = `${dateTime} - ${message.author.username} - ${obj.scenarios}\n`;
        fs.appendFile(process.env.SCENARIO_LOG, dataForLog, (err) => {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
        err ? message.channel.send(`${err}`) : message.channel.send(`You updated the scenario URL.`);
      });
    });
  } else if(message.content.toLowerCase() === '!channels') {
    console.log(client.channels);
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
