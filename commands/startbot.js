const { client } = require('tmi.js')
const filesManagers = require('../utils/filesManagers')

let myLoop = null
let isStarting = false

const startLoop = (executeWinner, channel)=>{
    isStarting = true

    myLoop = setInterval(() => {
        executeWinner(channel)
    }, filesManagers.getSettings("settings", "cooldown") * 1000 * 60)
}

const stopLoop = () => {
    clearInterval(myLoop)
    isStarting = false
    myLoop = null
}

module.exports = (channel, tags, client, executeWinner) => {
    if(tags.mod || tags.badges != null && tags.badges["broadcaster"] == "1"){
        if(myLoop == null){
            client.say(channel, filesManagers.getSettings("message", "bot_start"))
            startLoop(executeWinner, channel)
        }else{
            client.say(channel, filesManagers.getSettings("message", "bot_stop"))
            stopLoop()
        }
    }
}