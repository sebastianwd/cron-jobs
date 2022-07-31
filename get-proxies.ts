import axios from 'axios'
import fs from 'fs'

export const getProxies = async () => {
  const response = await axios.get<string>('https://spys.me/proxy.txt')

  if (!response.data) {
    console.info('No proxies found')
    return
  }

  const data: { ip: string; country: string }[] = []

  response.data.split('\n').forEach((item: string) => {
    if (!item) {
      return
    }

    const [ip, country] = item.split(' ')

    if (country) {
      const countryCode = country.split('-')?.[0]

      if (countryCode?.length === 2 && countryCode?.toUpperCase() === countryCode) {
        data.push({ ip, country: countryCode })
      }
    }
  })

  console.info(`${data.length} proxies found`)

  fs.writeFileSync('proxies.json', JSON.stringify(data))
}
