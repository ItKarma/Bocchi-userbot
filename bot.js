const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const ping = require ("ping");
require('dotenv').config();

const apiId = 7179733;
const apiHash = process.env.API_HASH; 
const stringSession = new StringSession(process.env.STRING_SESSION);

(async () => {
  try {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.connect(); 
    await client.start({
        phoneNumber: async () => await input.text("Your number: "),
        password: async () => await input.text("Your password (2FA): "),
        phoneCode: async () => await input.text("Received code: "),
        onError: (err) => console.log(err),
    });

    console.log("Started!")

    const result = setInterval(async() => {
        let resp = await ping.promise.probe('api.telegram.org')
        let pings = resp.avg *2 / 1000;
        let pingtext = `⏱ Request ping : ${pings} MS.`;
        
        client.invoke(
            new Api.account.UpdateProfile({
                // set the status
                about: pingtext // text
            })
        )
    },3000);

}catch(e){
  console.log(e)
}})();
