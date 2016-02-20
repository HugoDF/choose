var utils = {};
utils.verify = function(message){
  return message.token === process.env.VERIFICATION_TOKEN;
}
utils.formatDate = function(date){
  return date.toLocaleDateString();
}
module.exports = utils;