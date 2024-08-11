const { Logger } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
const fs = require("fs");
const simpleGit = require("simple-git");
const { LogLevel } = require("telegram/extensions/Logger");
const Message = require("./src/lib/Message.js");
const {CreateClient } = require("./src/lib/createClient");
const {  setSudo } = require("./config");
const git = simpleGit();
require("dotenv").config();

const modules = [];

function Module(moduleConfig, callback) {
  console.log(callback)
  modules.push({ ...moduleConfig, callback });
}


const stringSession = new StringSession(process.env.STRING_SESSION || "");

(async () => {
  console.log("Bot is starting...");

  const client = new CreateClient(stringSession, Number(process.env.API_ID), process.env.API_HASH, {
    connectionRetries: 5,
    baseLogger: new Logger(LogLevel.ERROR),
  });

  client.addEventHandler(async (event) => {
    let test = new Message(client, event.message);
    const message = event.message.message;
  //  console.log(message)
    const sender = await event.message.getSender();
   // console.log(sender)

    

    if (message) {
      for (const module of modules) {
        if ((module.fromMe) || !module.fromMe) {
          
          const regex = new RegExp(`^\\.\\s*${module.pattern}`);
          const match = message.match(regex);
          if (match) {
            console.log(module)
            module.callback(test, match);
          }
        }
      }
    }
    for (const module of modules) {
      if (module.on && module.on == "message" && ((module.fromMe && sender.self) || !module.fromMe)) {
        module.callback(test);
      }
    }
  }, new NewMessage({}));
  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
  if (process.env.STRING_SESSION == "") {
    let a = client.session.save();
    let file = await fs.readFileSync(".env", "utf8");
    file += `\nSESSION=${a}`;
    fs.writeFileSync(".env", file);
  }
  console.log("Bot is ready.");
  const me = await client.getMe();
  setSudo(me.id);
  //require("./bot/index");
  await client.sendMessage("me", { message: "Bot has been started.." });

})();


Module(
  { pattern: "start", fromMe: true, desc: "Start command", use: "utility" },
  async (m) => {
    const sender = await m.message.getSender();
    await m.client.sendMessage(sender, {
      message: `Hi, your ID is ${m.message.senderId}`,
    });
  }
);

module.exports = {
  Module,
  modules,
};

const pluginFolder = "./src/plugins/";
const files = fs.readdirSync(pluginFolder);

files.forEach((file) => {
  if (file.endsWith(".js")) {
    //console.log(file)
    const filePath = pluginFolder + file;
    require(filePath);
  }
});