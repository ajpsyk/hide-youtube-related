let tabStates = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isPageComplete = changeInfo.status === "complete";
    const isYoutube = tab.url && tab.url.includes("youtube.com");

    if (!isYoutube) delete tabStates[tabId];
    if (tabStates[tabId] && isPageComplete && isYoutube) chrome.tabs.sendMessage(tabId, { message: "YT_PAGE_LOADED", url: tab.url});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "SCRIPTS_LOADED" && sender.tab) {
        tabStates[sender.tab.id] = true;
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStates[tabId];
});