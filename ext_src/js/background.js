//getting data from head element

let extractAppleTouchIcon = (headContent) => {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = headContent;
  let appleTouchIconElement = tempDiv.querySelector(
    'link[rel="apple-touch-icon"]'
  );
  console.log(appleTouchIconElement);
  let appleTouchIconLink = appleTouchIconElement
    ? appleTouchIconElement.getAttribute('href')
    : null;
  return appleTouchIconLink;
};

let updatePresence = (tab) => {
  if (tab) {
    let url = new URL(tab.url);
    console.log(url);

    chrome.tabs.executeScript(
      tab.id,
      { code: 'document.head.outerHTML' },
      (result) => {
        let headContent = result[0] || '';
        let largeIconContent = extractAppleTouchIcon(headContent);
        console.log(largeIconContent);

        chrome.tabs.get(tab.id, (tabInfo) => {
          let largeIcon = tabInfo.favIconUrl;
          var data = {
            action: 'set',
            url: tab.url,
            details: url.hostname,
            state: tab.title,
            smallText: tab.url,
            largeText: tab.title,
            largeIcon,
            largeIconContent,
          };
          sendData(data);
        });
      }
    );
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
