let rpcEnable = true;
let largeIconContentValue = null;

// Listen for messages from the popup to update rpcEnable
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateRpcEnable') {
    rpcEnable = message.rpcEnable;
    console.log(rpcEnable);
  }

  if (message.action === 'updateLargeIconContent') {
    largeIconContentValue = message.largeIconContent;
    console.log(largeIconContentValue);
  }
});

// Listen for tab updates to change largeIconContentValue
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = changeInfo.url;
    // Retrieve largeIconContentValue associated with the URL from storage
    chrome.storage.sync.get(url, (data) => {
      if (data[url]) {
        largeIconContentValue = data[url];
      } else {
        largeIconContentValue = null;
      }
    });
  }
});

// Listen for tab changes to reset largeIconContentValue
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const url = tab.url;
    // Retrieve largeIconContentValue associated with the URL from storage
    chrome.storage.sync.get(url, (data) => {
      if (data[url]) {
        largeIconContentValue = data[url];
      } else {
        largeIconContentValue = null;
      }
    });
  });
});

// Function to update the presence based on the tab information
let updatePresence = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      let tab = tabs[0];
      let url = new URL(tab.url);
      // Send message to content script to extract apple-touch-icon
      chrome.tabs.sendMessage(
        tab.id,
        { action: 'extractAppleTouchIcon' },
        (response) => {
          console.log(response);
          let data = {
            action: 'set',
            rpcEnable,
            url: tab.url,
            details: url.hostname,
            state: tab.title,
            smallText: tab.url,
            largeText: tab.title,
            largeIcon: tab.favIconUrl,
            largeIconContent: largeIconContentValue || response?.appleTouchIcon,
          };

          console.log(data);
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
