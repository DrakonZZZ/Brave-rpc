let stateText = document.getElementById('state');

document.addEventListener('DOMContentLoaded', () => {
  const rpcTgl = document.getElementById('rpcToggle');

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
});
