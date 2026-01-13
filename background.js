chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isPageComplete = changeInfo.status === "complete";
  const isVideoPage = tab.url && tab.url.includes("youtube.com/watch")
  
  if (isPageComplete && isVideoPage) {
    chrome.tabs.sendMessage(tabId, { message: "TAB_UPDATE"});
  }
});
