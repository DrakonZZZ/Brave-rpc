import Rpc from 'discord-rpc'
import { stateChange, activity } from './setActivity.js'

const rpc = new Rpc.Client({ transport: 'ipc' })

export let prevData = {}

export function initializeRpc() {
  rpc
    .login({ clientId: '612158030473068545' })
    .catch((err) => console.log('Your Discord client is not running'))

  rpc.on('ready', () => {
    console.log('Discord RPC is ready')
  })
}

export function handleRpcPostRequest(req, res) {
  const data = req.body
  if (data.action === 'set' && data.rpcEnable) {
    if (stateChange(data)) {
      prevData = data
      rpc.setActivity(activity(data))
    }
  } else if (data.action === 'clear') {
    rpc.clearActivity()
    res.status(400).send('Invalid action')
    return
  } else {
    rpc.clearActivity()
  }
  res.sendStatus(200)
}
