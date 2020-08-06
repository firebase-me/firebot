const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

require('dotenv').config();
require('http').createServer().listen(3000);
const config = require("./config.json");




/////////////////////
// TRACKERS
/////////////////////
let StartUp = false;
if (!StartUp) {
  StartUp = true;
  try {
    client.login(process.env.TOKEN);
  } catch (e) {
    console.log(e);
  }
}

///////////////////////
// MAIN PROCESS START
///////////////////////

function ProcessEvent(event, client) {
  try {
    if (event.t == "MESSAGE_REACTION_REMOVE" || event.t == "MESSAGE_REACTION_ADD") {
      const meta = event.d;

      let targetRole;
      // IS MESSAGE AGREE ROLE?
      if (config.ROLES[[meta.channel_id, meta.message_id].join(':')])
        targetRole = config.ROLES[[meta.channel_id, meta.message_id].join(':')];

      // IS MESSAGE ROLE TABLE?
      else if (objectContains(meta, config.ROLE_TABLE))
        targetRole = config.ROLES[meta.emoji.id] || config.ROLES[meta.emoji.name];
      // console.log(`<${meta.emoji.name}:${meta.emoji.id}>`);
      if (targetRole == null) return;

      if (event.t == "MESSAGE_REACTION_ADD")
        giveRole(meta.channel_id, meta.user_id, targetRole);
      if (event.t == "MESSAGE_REACTION_REMOVE")
        takeRole(meta.channel_id, meta.user_id, targetRole);
    }
  } catch (e) {
    console.log(e);
  }
}


// I've been informed several times to not store some values in global for obvious conflict reasons.
// and if not named correctly, I can see issues. 
// but i can't see much of a difference between global and process.env which seems to be a more 'sound' alternative, but is it really?


////////////////////////
// DISCORD ON(EVENTS) //
////////////////////////
client.on('message', message => {
  if (message.author.bot) return;	// is the user someone I should respond too?
  if (message.channel.type === "text")
    ProcessMessage(message);
});
client.on('raw', event => {
  ProcessEvent(event, client);
});
client.on('error', e => {
  console.log(e);
});
client.on('error', e => {
  console.log(e);
});


async function ProcessMessage(message) {

  if (!message.content.startsWith(config.PREFIX)) return; // is this a command?
  if (message.member.roles.has(config.MOD_ROLE)) {
    const parse = ParseMessage(message);
    try {
      switch (parse.command) {
        case "help": message.channel.send(`Commands:
        !link EMOTE @ROLE
        !unlink EMOTE
        !set http://discord/message/url
        !accept EMOTE
        !decline EMOTE
        !setrole @ROLE http://discord/message/url
        !removerole http://discord/message/url`);
          break;
        case "link": UpdateLink(parse); break;
        case "unlink": DeleteLink(parse); break;
        case "set": SetTable(parse); break;
        case "accept": SetAccept(parse); break;
        case "decline": SetDecline(parse); break;
        case "setrole": SetRole(parse); break;
        case "removerole": RemoveRole(parse); break;
      }
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  }
}

function ParseMessage(msg) {
  // Clean message content
  _args = msg.content.replace(/ /g, ' ').split(/\s+/); //split message into sections based on spaces, ignore any 0 length values
  try {
    _args[0] = _args[0].replace(config.PREFIX, ''); // purge prefix from first arg to get pure value
    if (_args[0] == '')
      _args.shift();
    _command = _args.shift() || ""; // shift command from array list and save as a command
    _argresult = _args.join(' '); //condense array into simplified string for secondary parsing
    _command = _command.toLowerCase();
  }
  catch (e) {
    console.log(e);
    Log.LogEvent(msg, { command: "FATAL ERROR", args: [], argresult: msg.content }, 0xe52dbd);
  }
  return {
    command: _command,
    args: _args,
    argresult: _argresult
  };
}

function objectContains(input, mask) {
  for (let key of Object.keys(mask)) {
    if (input[key] !== mask[key]) {
      return false;
    }
  }
  return true;
}

async function giveRole(channel, user, role_id) {
  try {
    c = client.channels.get(channel);
    m = await c.guild.fetchMember(user);
    console.log(role_id);
    r = c.guild.roles.get(role_id);
    m.addRole(r);
  }
  catch (e) {
    console.log(e);
  }
}

async function takeRole(channel, user, role_id) {
  try {
    c = client.channels.get(channel);
    m = await c.guild.fetchMember(user);
    console.log(role_id);
    r = c.guild.roles.get(role_id);
    m.removeRole(r);
  }
  catch (e) {
    console.log(e);
  }
}


async function SetRole(parse){
  const urlMessage = config.ROLE_TABLE = DecodeUrl(parse.args[1]);
  const targetRole = EmoteID(parse.args[0]);
  if (urlMessage != null) {
    if(!config.ACCEPT) return;
    const newMessage = await client.channels.get(urlMessage.channel).fetchMessage(urlMessage.message);
    newMessage.react(config.ACCEPT);
    config.ROLES[[newMessage.channel.id, newMessage.id].join(':')] = targetRole;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
  }
}
async function RemoveRole(parse){
  const urlMessage = config.ROLE_TABLE = DecodeUrl(parse.args[0]);
  if (urlMessage != null) {    
    const newMessage = await client.channels.get(urlMessage.channel).fetchMessage(urlMessage.message);
    newMessage.reactions.cache.get(config.ACCEPT).remove().catch(error => console.error('Failed to remove reactions: ', error));
    delete config.ROLES[[newMessage.channel.id, newMessage.id].join(':')];
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
  }
}

// CONFIGURE ACCEPT AND DECLINE EMOTES
function SetAccept(parse){
  config.ACCEPT = EmoteID(parse.args[0]);
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}
function SetDecline(parse){
  config.DECLINE = EmoteID(parse.args[0]);
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}


// MANAGE EMOTE AND ROLE LINKS
function UpdateLink(parse) {
  const emote = EmoteID(parse.args[0]);
  const role = EmoteID(parse.args[1]);
  config.ROLES[emote] = role;
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}
function DeleteLink(parse) {
  const emote = EmoteID(parse.args[0]);
  delete config.ROLES[emote];
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}

// DEPLOY ROLE TABLE TO MESSAGE
async function SetTable(parse) {
  const urlMessage = config.ROLE_TABLE = DecodeUrl(parse.argresult);
  if (urlMessage != null) {
    const newMessage = await client.channels.get(urlMessage.channel).fetchMessage(urlMessage.message);
    SetEmotes(newMessage);
    config.ROLE_TABLE = urlMessage;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
  }
}

// CORE FUNCTIONS
function DecodeUrl(url) {
  if (typeof url != "string") return null;
  var properties = url.toString().split("/");
  if (properties.length == 7) {
    var _channelID = properties[5];
    var _messageID = properties[6];
    return {
      channel: _channelID,
      message: _messageID
    };
  }
  else return null;
}

function SetEmotes(msg) {
  Object.keys(config.ROLES).forEach(item => {
    console.log(item);
    msg.react(item);//item.match(fetchNumbers).join(""));
  });
}

const fetchNumbers = /[0-9]*/g;
function EmoteID(_emote) {
  var emote = _emote.match(fetchNumbers).join("");
  if (emote.length <= 1)
    emote = _emote;
  return emote;
}