import express from 'express';
import Rpc from 'discord-rpc';
import logBoxedObject from './utils/logBox.js';

const app = express();
const PORT = 3000;

app.use(express.json());

const rpc = new Rpc.Client({ transport: 'ipc' });
let prevData = {};

const activity = (data) => {
  let largeImageKey = data.largeIcon;
  if (
    (largeImageKey && largeImageKey.endsWith('.ico')) ||
    largeImageKey === ''
  ) {
    largeImageKey = '1brave';
  }

  const presenceData = {
    state: data.state,
    details: data.details,
    startTimestamp: new Date().getTime(),
    largeImageKey: data.largeIconContent
      ? data.largeIconContent.startsWith('http')
        ? data.largeIconContent
        : 'https://' + data.details + data.largeIconContent
      : largeImageKey,
    largeImageText: 'Brave Browser',
    buttons: [{ label: 'Visit the site', url: data.url }],
    instance: true,
  };
  logBoxedObject(presenceData);
  return presenceData;
};

const stateChange = (obj) => {
  if (Object.keys(obj).length !== Object.keys(prevData).length) return true;

  for (let key in prevData) {
    if (!obj.hasOwnProperty(key) || prevData[key] !== obj[key]) return true;
  }

  return false;
};

rpc.on('ready', () => {
  app.post('/', (req, res) => {
    const data = req.body;
    if (data.action === 'set' && data.rpcEnable) {
      if (stateChange(data)) {
        prevData = data;
        rpc.setActivity(activity(data));
      }
    } else if (data.action === 'clear') {
      rpc.clearActivity();
      throw new Error('not a valid link');
    } else {
      rpc.clearActivity();
    }
    res.sendStatus(200);
  });
});

app.listen(PORT, () => console.log(`Brave RPC is running on PORT: ${PORT}`));

try {
  rpc.login({ clientId: '612158030473068545' });
} catch (error) {
  console.error(error);
  console.log('your discord client is not running');
}
