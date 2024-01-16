import express from 'express';
import Rpc from 'discord-rpc';

const app = express();
const PORT = 3000;

app.use(express.json());

const rpc = new Rpc.Client({ transport: 'ipc' });

const activity = (data) => {
  const presenceData = {
    state: data.state,
    details: data.details,
    startTimestamp: new Date().getTime(),
    largeImageKey: data.largeIconContent
      ? data.largeIconContent.startsWith('http')
        ? data.largeIconContent
        : 'https://' + data.details + data.largeIconContent
      : 'bb',
    largeImageText: 'Drakonz Brave Browser',
    buttons: [{ label: 'Visit the site', url: data.url }],
    instance: true,
  };
  console.log(presenceData);
  return presenceData;
};

rpc.on('ready', () => {
  app.post('/', (req, res) => {
    let data = req.body;
    if (data.action === 'set') {
      rpc.setActivity(activity(data));
    } else if (data.action === 'clear') {
      rpc.clearActivity();
      throw new Error('not a valid link');
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
