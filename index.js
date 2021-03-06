const express = require('express'),
  Discord = require('discord.js'),
  client = new Discord.Client(),
  GUILD_NAME = process.env.GUILD_NAME || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '';

var app = express();

var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// Bot authentification
client.login(BOT_TOKEN);

client.on('ready', () => {
  var guilds = client.guilds.array(),
    membersCount = 0;
  guilds.forEach(item => {
    if (item.name === GUILD_NAME) {
      membersCount = item.memberCount;
      app.get('/', function(req, res) {
        res.jsonp({ channel: GUILD_NAME, members: membersCount });
      });
    }
  });
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
