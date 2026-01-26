// Todo: Fix error regarding content scripts not being loaded on already open tabs when extension is installed.
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url?.includes("youtube.com")) chrome.tabs.sendMessage(tab.id, { message: "YT_PAGE_ACTIVE" });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isPageComplete = changeInfo.status === "complete";
    const isYoutube = tab.url?.includes("youtube.com");
    if (isPageComplete && isYoutube) chrome.tabs.sendMessage(tabId, { message: "YT_PAGE_LOADED" });
});
