var utils = {};
utils.verify = function(message){
  return message.token === process.env.VERIFICATION_TOKEN;
}
utils.formatDate = function(date){
  return date.toLocaleDateString();
}
utils.getFunnyConversion = function(){
  var funnyTimeConversions = [
    {
      text: ":coffee:",
      minutesToComplete: 10
    },
    {
      text: ":egg:",
      minutesToComplete: 4
    },
    {
      text: ":iphone: charges",
      minutesToComplete: 300
    },
    {
      text: ":satellite: ISS rotations of the earth",
      minutesToComplete: 91
    },
    {
      text: ":airplane: New York - Paris in the Concord",
      minutesToComplete: 210
    },
    {
      text: ":sunny: to :earth_africa: for a photon",
      minutesToComplete: 8.3
    },
    {
      text: ":stopwatch: record time up the stairs in the Empire State Building",
      minutesToComplete: 10
    }
  ];
  var rand = Math.round(Math.random() * (funnyTimeConversions.length-1));
  return funnyTimeConversions[rand];
}
utils.isLevel = function(number){
  return Number.isInteger(.4 * Math.sqrt(number));
}
module.exports = utils;
