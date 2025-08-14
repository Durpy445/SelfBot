const { Client, Intents   } = require('discord.js-selfbot-v13');
const fs = require('fs');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT
  ]
});
const Token = fs.readFileSync('Token.txt').toString()

let AllowedChannelIDs = []
let TempAllowed= []
let responsesArray = []


Refresh = function(){
  let rawData = fs.readFileSync('Responses.json', 'utf8');
  responsesArray = JSON.parse(rawData);
  let rawData2 = fs.readFileSync('Channels.json', 'utf8');
  AllowedChannelIDs = JSON.parse(rawData2);
  TempAllowed = []
}

Refresh()


client.login(Token);
client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);
});

RandomString = function(){
  const random = Math.floor(Math.random() * responsesArray.length)
  return responsesArray[random]
}

client.on('messageCreate', async (message) => {
 if (message.mentions.has(client.user)  && message.content.includes("<@569611563745542174>")) { //Replace 569611563745542174 with your discord ID
  //Admin Commands
  if (message.author.id == client.user.id){
    console.log("Hi")
    let content = message.content
    if (content.includes("/Refresh")){
      Refresh()
      message.reply("```".concat("Refreshed").concat("```"));
      return
    }else if(content.includes("/Add")){
      let matches = content.match(/"([^"]*)"/g);
      let cleaned = matches.map(m => m.slice(1, -1)); 
      responsesArray.push(...cleaned);
      fs.writeFileSync('Responses.json', JSON.stringify(responsesArray, null, 2), 'utf8');
      message.reply("```".concat("Added: ").concat(cleaned).concat("```"));
      return
    }else if(content.includes("/Allow")){
      AllowedChannelIDs.push(message.channel.id)
      message.reply("```".concat("Allowed Channel").concat("```"));
      fs.writeFileSync('Channels.json', JSON.stringify(AllowedChannelIDs, null, 2), 'utf8');
      return
    }else if(content.includes("/Temp")){
      TempAllowed.push(message.channel.id)
      message.reply("```".concat("Added Until Next Refresh").concat("```"));
      return
    }
  }
  //Everyone Else 
  if (AllowedChannelIDs.includes(message.channel.id) || TempAllowed.includes(message.channel.id)){
    await message.reply("```".concat(RandomString()).concat("```"));
  }else if(message.author.id == client.user.id){
    console.log("ovveride")
    await message.reply("```".concat(RandomString()).concat("```"));
  }
 }
});

