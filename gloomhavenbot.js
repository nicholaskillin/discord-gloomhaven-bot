require('dotenv').config({ path: '/home/pi/Desktop/gloomhavenBot/.env' })
require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const token = process.env.GLOOMHAVEN_BOT_TOKEN
const publicIp = require('public-ip')
const fs = require('fs')

client.login(token)

client.on('ready', () => {
  client.user.setPresence({
    activity: { name: '"!help" for help' },
    status: 'online',
  })
})

client.on('message', (message) => {
  if (message.content.toLowerCase() === '!market') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data)
      message.channel.send(
        `You can access the parties market here\n${obj.market}`
      )
    })
  } else if (message.content.toLowerCase() === '!suzymarket') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data)
      message.channel.send(
        `You can access the parties storyline here\n${obj.suzyMarket}`
      )
    })
  } else if (message.content.toLowerCase() === '!scenarios') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data)
      message.channel.send(
        `You can access the parties storyline here\n${obj.scenarios}`
      )
    })
  } else if (message.content.toLowerCase() === '!suzyscenarios') {
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const obj = JSON.parse(data)
      message.channel.send(
        `You can access the parties storyline here\n${obj.suzyScenarios}`
      )
    })
  } else if (message.content.toLowerCase().includes('marco')) {
    message.channel.send(`polo`)
  } else if (message.content.toLowerCase() === '!helpersettings') {
    let publicIpAddress = (async () => {
      return await publicIp.v4()
    })()
    publicIpAddress.then(function (address) {
      message.channel.send(`Address: ${address}\nPort: 58888`)
    })
  } else if (message.content.toLowerCase() === '!help') {
    const embed = new Discord.MessageEmbed()
      .setTitle('Gloomhaven Bot Help')
      .setDescription(
        'Here is a list of the things you can ask me:\n\n**!nextsession** or **!whattime**: This will tell you when our next Gloomhaven Online session starts.\n\n**!market**: This will give you the URL to our parties online town market.\n\n**!setmarketurl**: If you make a change to the market then we will need a new link to see your changes. You can click on the "Share" tab at the top of the market, then click on "Copy". This command should look something like:\n\n `!setmarketurl copied_url_here`\n\n**!scenarios**: This will give you the URL to our parties updated campaign status in a way that makes it easier to visualize the storyline.\n\n**!setscenariourl**: If you make a change to the scnario map then we will need a new link to see your changes. You can click on the Menu button in the top left of the window, then click on "Share", then click on "Copy the link". This command should look something like:\n\n `!setscenariourl copied_url_here`\n\n**!mycards**: This will give you the URL for an app you can use to manage your ability and attack modifier cards during the campaign.\n\n**!enhancementcalc**: This will give you a link to an online Ability Card Enhancement Calculator.\n\n**!helpersettings**: This will give you the current ip address and port to use in Gloomhaven Helper.\n\n**!envelopex**: This will tell you everything that we know about envelope x so far.'
      )
    message.channel.send(embed)
  } else if (message.content.toLowerCase() === '!mycards') {
    message.channel.send(
      "You can use the Gloomhaven Card Manager to manage your character's ability and attack modifier cards during the campaign.\nhttps://gloomhaven-hand-manager.herokuapp.com/."
    )
  } else if (
    message.content.toLowerCase() === '!nextsession' ||
    message.content.toLowerCase() === '!whattime'
  ) {
    getNextSession(message)
  } else if (
    message.content.toLowerCase() === '!gbstats' &&
    message.author.username === process.env.MY_USERNAME
  ) {
    message.author.send(
      `Here are the stats for Gloomhaven Bot 2.0.\n\nNumber of Servers: ${client.guilds.cache.size}`
    )
  } else if (message.content.toLowerCase().startsWith('!setmarketurl')) {
    const prefix = '!setmarketurl'
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1)
      const obj = JSON.parse(data)
      obj.market = newUrl
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date()
        var dataForLog = `${dateTime} - ${message.author.username} - ${obj.market}\n`
        fs.appendFile(process.env.MARKET_LOG, dataForLog, (err) => {
          if (err) throw err
        })
        err
          ? message.channel.send(`${err}`)
          : message.channel.send(`You updated the market URL.`)
      })
    })
  } else if (message.content.toLowerCase().startsWith('!setscenariourl')) {
    const prefix = '!setscenariourl'
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1)
      const obj = JSON.parse(data)
      obj.scenarios = newUrl
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date()
        var dataForLog = `${dateTime} - ${message.author.username} - ${obj.scenarios}\n`
        fs.appendFile(process.env.SCENARIO_LOG, dataForLog, (err) => {
          if (err) throw err
        })
        err
          ? message.channel.send(`${err}`)
          : message.channel.send(`You updated the scenario URL.`)
      })
    })
  } else if (message.content.toLowerCase().startsWith('!setsuzymarketurl')) {
    const prefix = '!setsuzymarketurl'
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1)
      const obj = JSON.parse(data)
      obj.suzyMarket = newUrl
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date()
        var dataForLog = `${dateTime} - ${message.author.username} - ${obj.suzyMarket}\n`
        fs.appendFile(process.env.SUZY_MARKET_LOG, dataForLog, (err) => {
          if (err) throw err
        })
        err
          ? message.channel.send(`${err}`)
          : message.channel.send(`You updated the market URL for you and Suzy.`)
      })
    })
  } else if (message.content.toLowerCase().startsWith('!setsuzyscenariourl')) {
    const prefix = '!setsuzyscenariourl'
    fs.readFile(process.env.URL_FILE, 'utf8', (e, data) => {
      const newUrl = message.content.slice(prefix.length + 1)
      const obj = JSON.parse(data)
      obj.suzyScenarios = newUrl
      fs.writeFile(process.env.URL_FILE, JSON.stringify(obj), (err) => {
        var dateTime = new Date()
        var dataForLog = `${dateTime} - ${message.author.username} - ${obj.suzyScenarios}\n`
        fs.appendFile(process.env.SUZY_SCENARIO_LOG, dataForLog, (err) => {
          if (err) throw err
        })
        err
          ? message.channel.send(`${err}`)
          : message.channel.send(`You updated the scenario URL for Suzy.`)
      })
    })
  } else if (message.content.toLowerCase() === '!channels') {
    client.channels.cache.forEach((channel) =>
      message.channel.send(`${channel.name} - ${channel.id}`)
    )
  } else if (message.content.toLowerCase() === '!envelopex') {
    const embed = new Discord.MessageEmbed()
      .setTitle('What we know about envelope x')
      .setDescription(
        'Here is what we know so far:\n\n**The letter**:\nWe found a letter that says:\n"We call from the dust-from the aged bones of those you have killed. Speak our name into his web and we will be free. 10 clues you must find 10 letters to our name. Here is our first: B"\n\n**Where are the clues**:\nFrom what is seen online, looks like they are everywhere. Be on the lookout in any graphics (monster standees, item cards, character images, box artwork) events cards, or scenario text.\n\n**Letters we have so far**:\nB - found in envelope x\nL - found in the image of the Earth Demon standee\nA - Found on the Ring of Skulls item card\nM - Found in the top right hand corner of the Gloomhaven Map\n\n**Other unsolved riddles**:\nFrom the end of the voice storyline:\n"The Creator has made a request for our spoils. The twelfth letter holds the key."\n\n**The cypher**:'
      )
      .setImage('https://i.imgur.com/qKqa6DP.jpg')
    message.channel.send(embed)
  } else if (message.content.toLowerCase().startsWith('!enhancementcalc')) {
    message.channel.send(
      'Here is an enhancement cost calculator.\nhttps://ninjawithkillmoon.github.io/utilities/enhancementCalculator.'
    )
  }
})

// Calendar Stuff

function getNextSession(message) {
  // Get events from Google Calendar
  const fs = require('fs')
  const readline = require('readline')
  const { google } = require('googleapis')

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents)
  })

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback)
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client)
    })
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
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err)
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err)
          console.log('Token stored to', TOKEN_PATH)
        })
        callback(oAuth2Client)
      })
    })
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(
      {
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err)
        const events = res.data.items
        if (events.length) {
          const start = events[0].start.dateTime || events[0].start.date
          postNextSession(message, start)
        } else {
          postNextSession(message, 'no events')
        }
      }
    )
  }
}

function postNextSession(message, event) {
  if (event === 'no events') {
    message.channel.send(`We don't have any sessions scheduled right now.`)
  } else {
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    let eventStart = new Date(event)
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }

    const isToday = (someDate) => {
      const today = new Date()
      return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
      )
    }
    var timeString = eventStart.toLocaleString('en-US', options)

    if (isToday(eventStart)) {
      message.channel.send(`We are playing today at ${timeString}.`)
    } else {
      message.channel.send(
        `We are playing on ${
          days[eventStart.getDay()]
        } ${eventStart.getMonth()}/${eventStart.getDate()} at ${timeString}.`
      )
    }
  }
}

process.on('unhandledRejection', (error, promise) => {
  // let user = client.users.get()
  console.log(
    ' Oh Lord! We forgot to handle a promise rejection here: ',
    promise
  )
  console.log(' The error was: ', error)
})
