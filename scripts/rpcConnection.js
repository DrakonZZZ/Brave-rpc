import Rpc from 'discord-rpc'
import { stateChange, activity } from './setActivity.js'

const rpc = new Rpc.Client({ transport: 'ipc' })
export let prevData = {}

export function initializeRpc() {
  rpc.on('ready', () => {
    console.log('Discord RPC is ready')
  })

  rpc
    .login({ clientId: '612158030473068545' })
    .catch((err) => console.error('Discord client not running:', err))

  rpc.on('error', (err) => {
    console.error('RPC error:', err)
  })
}

export function handleRpcPostRequest(req, res) {
  try {
    const data = req.body

    if (data.action === 'set' && data.rpcEnable) {
      if (stateChange(data)) {
        prevData = data
        rpc.setActivity(activity(data))
      }
    } else if (data.action === 'clear') {
      rpc.clearActivity()
      return res.status(400).send('Activity cleared')
    } else {
      rpc.clearActivity()
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Failed to handle RPC request:', error)
    res.status(500).send('Server error')
  }
}
