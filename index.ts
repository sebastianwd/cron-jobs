import fastify from 'fastify'
import cron from 'node-cron'
import fs from 'fs'
import { getProxies } from './get-proxies'

const server = fastify()

const getProxiesJob = cron.schedule('0 */4 * * *', getProxies, { scheduled: false })

server.get('/proxies', async (request, reply) => {
  const params = request.query as { country: string }

  const data = fs.readFileSync('proxies.json')

  if (params.country) {
    const country = params.country.toUpperCase()

    const proxies = JSON.parse(data.toString()).filter((item: { country: string }) => item.country === country)

    reply.send(proxies)
  }

  reply.send(JSON.parse(data.toString()))
})

server.get('/', async (request, reply) => {
  reply.code(200).send({ message: 'Hello world!' })
})

const bindingAddress = process.env.BINDING_ADDRESS || ''

server.listen(process.env.PORT || 8080, bindingAddress, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  getProxiesJob.start()

  await getProxies()

  console.log(`Server listening at ${address}`)
})
