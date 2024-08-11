const { Module } = require("../../bot.js");

Module(
  { pattern: "ping", fromMe: true, desc: "Ping command", use: "utility" },
  async (m, match) => {
    
    let start = new Date().getTime();
    
    await m.edit({ text: `❮ 🏓 ᴛᴇsᴛɪɴɢ ᴘɪɴɢ ❯` });
    let end = new Date().getTime();
    await m.edit({ text: `⚡ ʟᴀᴛᴇɴᴄʏ: ${end - start} ᴍs`});
  }
);

Module(
  { pattern: "id", fromMe: true, desc: "Id command", use: "utility" },
  async (m, match) => {
    if (m.quoted) {
      const quoted = await m.getQuoted();
      let id =quoted.jid
      let username = await m.getUsername(id);
      return await m.edit({ text : `ID @${username} is ${id}` });
    }
    let id = m.jid;
    let username = await m.getUsername(id);
    return await m.edit({ text : `ID @${username} is ${id}` });
  }
);