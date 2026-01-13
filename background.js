chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const pageRefreshOrURLChange = changeInfo.status === "complete" || changeInfo.url;
  const isVideoPage = tab.url && tab.url.includes("youtube.com/watch")

  if (pageRefreshOrURLChange && isVideoPage) {
    chrome.tabs.sendMessage(tabId, { message: "TAB_UPDATE"});
  }
});
