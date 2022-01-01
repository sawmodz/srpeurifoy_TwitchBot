const translate = require('@vitalets/google-translate-api')
const filesManagers = require('./utils/filesManagers')
const tmi = require('tmi.js')

const startBot = require("./commands/startbot")

let participant = []
let winnerName = null

const executeWinner = (channel)=>{
    if(participant.length != 0){
        winner = participant[Math.floor(Math.random()*participant.length)]
        client.say(channel, filesManagers.getSettings("message", "winner_message").replace("%username%", winner))
        winnerName = winner
        participant = []
    }
}

const client = new tmi.Client({
	options: { debug: true },
	identity: {
        username: filesManagers.getSettings("auth", "bot_name"),
		password: "oauth:"+filesManagers.getSettings("auth", "password")
	},
	channels:filesManagers.getSettings("auth", "channel_to_connect")
})

client.connect()

client.on("message", (channel, tags, message, self) => {
    //if(self) return

    switch (message.toLowerCase().split(" ")[0]) {
        case "!startbot" :
            startBot(channel, tags, client, executeWinner)
            return;
    }

    if(!participant.includes(tags.username)){
        participant.push(tags.username)
    }

    if(tags.username == winnerName){
        let code = message.split(":")[0]
        if(code == "ronin"){
            let code = message.split(":")[1]
            if(code != null && code.length == 36){
                client.say(channel, "you type correct code")
            }else{
                console.log(filesManagers.getSettings("message", "wrong_code"))
                client.say(channel, filesManagers.getSettings("message", "wrong_code"))
            }
        }
    }
})