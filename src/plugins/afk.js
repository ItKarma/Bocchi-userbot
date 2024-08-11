const { Module } = require("../../bot.js");
Module(
  { pattern: "afk", fromMe: true, desc: "Ping command", use: "utility" },
  async (m, match) => {

    let start = new Date().getTime();
    
    await m.edit({ text : "meu deus"});
    let end = new Date().getTime();
    //await m.send(`ʟᴀᴛᴇɴᴄʏ: ${end - start} ᴍs`);
  }
);