import 'dotenv/config'
import sharp from 'sharp'
import fs from 'fs'

import { microservice, channel } from '@providers/rabbitmq'

let data

(async () => {
  try {
    await microservice('rpc_proc')
    channel.consume('rpc_proc', async (msg) => {
      data = msg.content
      fs.access('../uploads', (err) => {
        if (err) {
          fs.mkdirSync('../uploads')
        }
      })
      const generated = new Date().toISOString()
      await sharp(data)
        .resize(500)
        .jpeg({ quality: 85 })
        .toFile('../uploads/' + `${generated}.jpeg`)
      data = `http://localhost:4000/${generated}.jpeg`
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(data)), {
        correlationId: msg.properties.correlationId
      })
      channel.ack(msg)
    }, { noAck: false })
  } catch (err) {
    console.log(err)
  }
})()
