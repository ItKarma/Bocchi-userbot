const {
    Api,
    TelegramClient
} = require("telegram"); // npm i telegram

const {
    StringSession
} = require("telegram/sessions");


const input = require("input"); // npm i input
const ping = require ("ping"); //npm i ping

const apiId = 123456; // id from my.telegram.org
const apiHash = "hash"; // hash from my.telegram.org


const stringSession = new StringSession(""); // You should put your string session after init and login here
(async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.connect(); // This assumes you have already authenticated with .start()
    await client.start({
        phoneNumber: async () => await input.text("Your number: "),
        password: async () => await input.text("Your password (2FA): "),
        phoneCode: async () => await input.text("Received code: "),
        onError: (err) => console.log(err),
    });

    console.log("Started!")
    const result = setInterval(async() => {
        var resp = await ping.promise.probe('api.telegram.org')
        var pings = resp.avg *2 / 1000;
        var pingtext = `⏱ Request up to api.telegram.org: ${pings} MS.`;

        client.invoke(
            new Api.account.UpdateProfile({
                // set the status
                about: pingtext // text
            })
        )

    },
        3000); // update interval, now it is 3 seconds

    console.log(client.session.save()); /* You will receive the session as a string, which must be inserted into a variable: stringSession ↑ */
    console.log(result); // prints the result

})();