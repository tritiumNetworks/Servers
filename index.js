const { Client } = require('discord.js')
const { exec } = require('child_process')
const client = new Client()
const settings = require('./settings.json')
client.login(settings.botToken)

setInterval(() => {
  settings.services.forEach((s) => {
    exec('systemctl status ' + s.name, (_, out) => {
      const gotData = out.split('\n').slice(0, 3)
      const enabled = gotData[1] ? gotData[1].includes('; enabled') : false
      const active = gotData[2] ? gotData[2].includes('active (running)') : false
      const result =
        s.name.toUpperCase() + ' (클러스터 ' + s.cluster + '번)\n '
        + (active ? ':green_circle: **정상**' : ':red_circle: **종료됨**') + ', ' + (enabled ? '활성화 됨' : '비활성화 됨')

      client.channels.resolve(settings.channels[s.cluster]).messages.fetch(s.message)
        .then((m) => { if (m) m.edit(result) })
    })
  })
}, settings.interval)
