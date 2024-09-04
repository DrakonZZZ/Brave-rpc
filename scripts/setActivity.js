import { prevData } from './rpcConnection.js'
import { logBoxedObject } from './utils/logBox.js'

const activity = (data) => {
  let largeImageKey = data.largeIcon

  if (
    !largeImageKey ||
    largeImageKey.endsWith('.ico') ||
    largeImageKey === ''
  ) {
    if (!data.largeIconContent || data.largeIconContent === '') {
      largeImageKey = '1brave'
    }
  }

  let truncatedState =
    data.state.length > 128 ? data.state.slice(0, 128) : data.state
  let truncatedUrl = data.url.length > 512 ? data.url.slice(0, 512) : data.url

  const presenceData = {
    state: truncatedState,
    details: data.details,
    startTimestamp: new Date().getTime(),
    largeImageKey: data.largeIconContent
      ? data.largeIconContent.startsWith('http')
        ? data.largeIconContent
        : 'https://' + data.details + data.largeIconContent
      : largeImageKey,
    largeImageText: 'Brave Browser',
    buttons: [{ label: 'Visit the site', url: truncatedUrl }],
    instance: true,
  }

  logBoxedObject(presenceData)
  return presenceData
}

const stateChange = (obj) => {
  if (Object.keys(obj).length !== Object.keys(prevData).length) return true

  for (let key in prevData) {
    if (!obj.hasOwnProperty(key) || prevData[key] !== obj[key]) return true
  }

  return false
}

export { activity, stateChange }
