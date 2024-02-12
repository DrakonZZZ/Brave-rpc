document.addEventListener('DOMContentLoaded', () => {
  let stateText = document.getElementById('state');
  const rpcTgl = document.getElementById('rpcToggle');
  const imageInput = document.getElementById('image-rpc');
  const addButton = document.getElementById('image-btn');

  // Retrieve the stored rpcDisabled value from storage and set the toggle accordingly
  chrome.storage.sync.get('rpcDisabled', (data) => {
    rpcTgl.checked = !data.rpcDisabled;
  });

  // Listen for changes in the toggle button state
  rpcTgl.addEventListener('change', () => {
    const rpcEnable = rpcTgl.checked;
    stateText.innerText = rpcEnable ? 'Enabled' : 'Disabled';
    chrome.storage.sync.set({ rpcDisabled: !rpcEnable });
    chrome.runtime.sendMessage({ action: 'updateRpcEnable', rpcEnable });
  });

  // Listen for click event on the button
  addButton.addEventListener('click', () => {
    const inputValue = imageInput.value.trim();
    if (inputValue) {
      // Get the current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const currentTab = tabs[0];
          const currentUrl = currentTab.url;
          // Save largeIconContent for the current URL to chrome storage
          chrome.storage.sync.set({ [currentUrl]: inputValue }, () => {
            // Send a message to update the largeIconContent in background.js
            chrome.runtime.sendMessage({
              action: 'updateLargeIconContent',
              largeIconContent: inputValue,
            });
          });
        }
      });
    }
  });
});
