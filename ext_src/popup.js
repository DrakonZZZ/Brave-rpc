document.addEventListener('DOMContentLoaded', () => {
  let stateText = document.getElementById('state');
  const rpcButton = document.getElementById('rpcButton');
  const imageInput = document.getElementById('image-rpc');
  const addButton = document.getElementById('image-btn');

  // Retrieve the stored rpcEnable value from storage and set the button state accordingly
  chrome.storage.sync.get('rpcEnable', (data) => {
    const rpcEnabled = data.rpcEnable !== undefined ? data.rpcEnable : true;
    updateButtonState(rpcEnabled);
  });

  // Toggle button state when clicked
  rpcButton.addEventListener('click', () => {
    chrome.storage.sync.get('rpcEnable', (data) => {
      const rpcEnabled = data.rpcEnable !== undefined ? data.rpcEnable : true;
      console.log(rpcEnabled);
      updateButtonState(!rpcEnabled);
      chrome.storage.sync.set({ rpcEnable: !rpcEnabled });
      chrome.runtime.sendMessage({
        action: 'updateRpcEnable',
        rpcEnable: !rpcEnabled,
      });
    });
  });

  // Listen for click event on the "Add" button
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

  // Function to update the button state
  function updateButtonState(enabled) {
    if (enabled) {
      rpcButton.textContent = 'ON';
      rpcButton.classList.remove('off');
      rpcButton.classList.add('on');
      stateText.innerText = 'Enabled';
    } else {
      rpcButton.textContent = 'OFF';
      rpcButton.classList.remove('on');
      rpcButton.classList.add('off');
      stateText.innerText = 'Disabled';
    }
  }
});
