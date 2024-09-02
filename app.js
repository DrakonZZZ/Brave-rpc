import express from 'express'
import { handleRpcPostRequest, initializeRpc } from './scripts/rpcConnection.js'

const app = express()
const PORT = 3000

app.use(express.json())
initializeRpc()

app.post('/', handleRpcPostRequest)

app.listen(PORT, () => console.log(`Brave RPC is running on PORT: ${PORT}`))
