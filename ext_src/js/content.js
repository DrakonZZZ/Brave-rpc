chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message listener' + message);
  console.log(message + ' recieve message');
  if (message.action === 'extractAppleTouchIcon') {
    let appleTouchIcon;
    let appleTouchIconElement = document.querySelector(
      'link[rel="apple-touch-icon"]'
    );
    if (appleTouchIconElement) {
      appleTouchIcon = appleTouchIconElement.getAttribute('href');
    }

    sendResponse({ appleTouchIcon });
  }
});
