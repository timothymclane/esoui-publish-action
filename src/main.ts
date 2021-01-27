import * as core from '@actions/core'
import fs from 'fs'
import request from 'request-promise-native'

const getConfig = () => ({
  addonId: core.getInput('addonId'),
  apiVersions: core.getInput('apiVersions'),
  filePath: core.getInput('filePath'),
  token: core.getInput('token'),
  version: core.getInput('version'),
})

async function run(): Promise<void> {
  try {
    core.info('Starting request...')
    const config = getConfig()
    const currentAddon = await request({
      url: `https://api.esoui.com/addons/${config.addonId}.json`,
    })
    core.info('CurrentAddon:')
    core.info(currentAddon)
    const result = await request({
      url: 'https://api.esoui.com/addons/updatetest',
      method: 'POST',
      headers: { 'x-api-token': config.token },
      formData: {
        id: config.addonId,
        compatibility: config.apiVersions,
        updatefile: fs.createReadStream(config.filePath),
        version: config.version,
      },
    })
    core.info('Request complete')
    core.info(result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
