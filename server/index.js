var express = require('express');
var router = express.Router();

var redisConfig = {"url": process.env.REDIS_URL};
var redisStorage = require('botkit/lib/storage/redis_storage')(redisConfig);

if(process.env.LOCAL_REDIS){
  // is this a hack? maybe
  redisStorage = require('botkit/lib/storage/redis_storage')();
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var button = '<a href="https://slack.com/oauth/authorize?scope=commands&client_id=22163459079.22164560934"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>';
  redisStorage.teams.all(function(err, teams){
    if(!err){
      redisStorage.users.all(function(err, users){
        console.log(users);
        res.send(button + "Server app, teams: " + teams.length + " users: " + users.length);
      });
    }
    else{
      res.send("No teams" + button);
    }
  });
});

module.exports = router;