const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
require('dotenv').config()

const options = {
  host: 'mc.openredstone.org',
  auth: process.env.MC_AUTH,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  version: "1.18.2",
}

const bot = mineflayer.createBot(options)

bot.once('spawn', () => {
  bot.addChatPattern('raw_msg', /(.+)/, { parse: true })
  bot.addChatPattern('chat_msg', /(.+?) \| (.+?): (.*)/, { parse: true })
  bot.chat('This is the Human CPU Test Bot')
})

const get_block_above = (blockName) => {
  const block = bot.findBlocks({
    matching: (block) => block.name === blockName
  })

  if (block[0])
    return bot.blockAt(block[0].offset(0, 1, 0))
  return null
}

const set_lever_powered = (block, powered) => {
  if (block._properties.powered) {
    if (powered) return
    bot.activateBlock(block)
  } else {
    if (!powered) return
    bot.activateBlock(block)
  }
}

const commands = [
  ['.tp', (user, params) => {
    bot.chat(`/tp ${user}`)
  }],
  ['.activate', (user, params) => {
    const lever = get_block_above(`${params[1]}_wool`)

    if (lever !== null)
      bot.activateBlock(lever)
  }],
  ['.update', (user, params) => {
    const block_a = get_block_above("gray_wool")
    const block_b = get_block_above("light_gray_wool")
    const block_c = get_block_above("yellow_wool")
    const block_o = get_block_above("blue_wool")
    const block_co = get_block_above("light_blue_wool")

    if (block_a === null) return
    if (block_b === null) return
    if (block_c === null) return
    if (block_o === null) return
    if (block_co === null) return

    const a = block_a._properties.lit;
    const b = block_b._properties.lit;
    const c = block_c._properties.lit;
    const inputs = [a, b, c]

    console.log(inputs)

    const co = inputs.filter(v => v).length > 1;
    set_lever_powered(block_co, co)

    const o = inputs.filter(v => v).length % 2 == 1;
    set_lever_powered(block_o, o)
  }]
]

bot.on('chat:chat_msg', ([matches]) => {
  username = matches[1]
  message = matches[2]
  // bot.on('chat', (username, message) => {
  if (!(message.startsWith('.'))) return;
  const params = message.split(' ')

  commands.forEach((command) => {
    if (command[0] == params[0]) command[1](username, params)
  })
  console.log([username, message])
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)
