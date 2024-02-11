// Initialize rpcEnable with true
let rpcEnable = true;

// Listen for messages from the popup to update rpcEnable
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateRpcEnable') {
    rpcEnable = message.rpcEnable;
    console.log(rpcEnable);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateLargeIconContent') {
    largeIconContent = message.largeIconContent;
  }
});

// Function to update the presence based on the tab information
let updatePresence = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      let tab = tabs[0];
      let url = new URL(tab.url);
      chrome.tabs.sendMessage(
        tab.id,
        { action: 'extractAppleTouchIcon' },
        (response) => {
          let data = {
            action: 'set',
            rpcEnable,
            url: tab.url,
            details: url.hostname,
            state: tab.title,
            smallText: tab.url,
            largeText: tab.title,
            largeIcon: tab.favIconUrl,
            largeIconContent: largeIconContent || response?.appleTouchIcon,
          };

          sendData(data);
        }
      );
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
setInterval(() => {
  updatePresence();
}, 2000);
