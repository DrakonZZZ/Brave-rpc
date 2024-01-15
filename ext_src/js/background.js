let updatePresence = (tab) => {
  if (tab) {
    let url = new URL(tab.url);
    console.log(url);

    chrome.tabs.get(tab.id, (tabInfo) => {
      let faviconUrl = tabInfo.favIconUrl;

      var data = {
        action: 'set',
        url: tab.url,
        details: url.hostname,
        state: tab.title,
        smallText: tab.url,
        largeText: tab.title,
        largeIcon: faviconUrl,
      };

      sendData(data);
    });
  } else {
    var data = {
      action: 'clear',
    };

    sendData(data);
  }
};

let sendData = (data) => {
  let settings = {
    async: true,
    crossDomain: true,
    url: 'http://localhost:3000/',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    processData: false,
    data: JSON.stringify(data),
  };

  $.ajax(settings);
};

let lastCheckedTabId;

setInterval(() => {
  chrome.windows.getLastFocused({ populate: true }, (window) => {
    if (window.focused) {
      if (window.tabs)
        for (let tab of window.tabs) {
          if (tab.highlighted) {
            if (tab.id != lastCheckedTabId) {
              lastCheckedTabId = tab.id;
              updatePresence(tab);
            }
            break;
          }
        }
    }
  });
}, 500);
