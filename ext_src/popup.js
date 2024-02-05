document.addEventListener('DOMContentLoaded', () => {
  const rpcTgl = document.getElementById('rpcToggle');

  chrome.storage.sync.get('rpcDisabled', (data) => {
    rpcTgl.checked = !data.rpcDisabled;
  });

  rpcTgl.addEventListener('change', () => {
    const rpcEnable = rpcTgl.checked;
    chrome.storage.sync.set({ rpcDisabled: !rpcEnable });

    chrome.runtime.sendMessage({ rpcEnable });
  });
});
