// Initialize rpcEnable with true
let rpcEnable = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  rpcEnable = message.rpcEnable;
});

// Function to update the presence based on the tab information
let updatePresence = () => {
  chrome.windows.getLastFocused({ populate: true }, (window) => {
    if (window.focused && window.tabs) {
      for (let tab of window.tabs) {
        if (tab.highlighted) {
          let url = new URL(tab.url);

          let data = {
            action: 'set',
            rpcEnable,
            url: tab.url,
            details: url.hostname,
            state: tab.title,
            smallText: tab.url,
            largeText: tab.title,
            largeIcon: tab.favIconUrl,
          };

          sendData(data);
          break;
        }
      }
    }
  });
};

// Function to send data to the server
let sendData = (data) => {
  fetch('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Data sent successfully');
    })
    .catch((error) => {
      console.error('Error sending data:', error);
    });
};

// Interval to update presence periodically
let lastCheckedTabId;
setInterval(() => {
  updatePresence();
}, 2000);
