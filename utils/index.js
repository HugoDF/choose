var utils = {};
utils.verify = function(message){
  return message.token === process.env.VERIFICATION_TOKEN;
}
utils.formatDate = function(date){
  return date.getDate()+"" + (date.getMonth() + 1) +"" + date.getFullYear()
}
module.exports = utils;