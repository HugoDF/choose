
require('dotenv').config();

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');
var redisConfig = {"url": process.env.REDIS_URL}
var redisStorage = require('botkit/lib/storage/redis_storage')(redisConfig);
var utils = require('./utils');
var path = require('path');

if(process.env.LOCAL_REDIS){
  // reset redis to defaults
  redisStorage = require('botkit/lib/storage/redis_storage')();
}
  
if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET || !process.env.BOTKIT_PORT) {
  console.log('Error: Specify SLACK_CLIENT_ID SLACK_CLIENT_SECRET and BOTKIT_PORT in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  storage: redisStorage
}).configureSlackApp(
  {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    scopes: ['commands'],
  }
);


controller.setupWebserver((process.env.PORT || process.env.BOTKIT_PORT),function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
  webserver.set('views', path.join(__dirname, 'views'));
  webserver.set('view engine', 'hbs');
  webserver.use('/', require('./server'));
});

// just a simple way to make sure we don't
// connect to the RTM twice for the same team
var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('slash_command',function(bot,message) {
  //TODO: verify message using utils.verifyMessage
  var options = message.text.split(' ');
  var pick = Math.round(Math.random() * (options.length-1));
  var pickOption = options[pick];
  // reply to slash command
  var reply = "*" + pickOption + "*" + " from: _" + message.text + "_";
  // bot.replyPrivate(message, reply);

  //gather analytics to populate dashboard
  
  var userId = message.user;
  controller.storage.users.get(userId, function(err, user){
    if(!user){
      user = {
        id: userId
      }
    }
    var today = new Date(Date.now());
    var todayFormatted = utils.formatDate(today);
    if(!user[todayFormatted]){
      user[todayFormatted] = 0
    }
    user[todayFormatted] += 1;
    count = user[todayFormatted];
    controller.storage.users.save(user, function(err){
      if(err){
        console.log('Error storing user ' + user);
      }
      console.log("Stored: " + user.id + ", count:  " + count)
      if(count%5 === 0 || count===1 ){
        reply += "\n" + "You have made " + count + " decision(s) without their cognitive overhead\nThat means you've saved around " + count*10 + " minutes in decision-time today.";
      }
      bot.replyPrivate(message, reply);
    });
  });
});

controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    console.log("Team ", t);
    if (teams[t].bot) {
      var bot = controller.spawn(teams[t]).startRTM(function(err) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
          trackBot(bot);
        }
      });
    }
  }

});