import * as core from '@actions/core'
import { wait } from './wait'
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
    const config = getConfig()
    const result = await request({
      url: 'https://api.esoui.com/addons/updatetest',
      method: 'POST',
      headers: { 'x-api-token': config.token },
      formData: {
        'id': config.addonId,
        'compatible': config.apiVersions,
        'updateFile': fs.createReadStream(config.filePath),
        'version': config.version,
      }
    });

    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
