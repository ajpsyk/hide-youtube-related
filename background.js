
chrome.runtime.onInstalled.addListener(async () => {
    const tabs = await chrome.tabs.query({
      url: ["https://*.youtube.com/*"]
    });

    for (const tab of tabs) {
        try {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["cleanup.js", "contentScript.js"]
            })
            chrome.tabs.sendMessage(tab.id, { message: "YT_PAGE_LOADED" });
        } catch (err) { console.error(`Failed to inject scripts into tab: ${tab.id}`); }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isPageComplete = changeInfo.status === "complete";
    const isYoutube = tab.url?.includes("youtube.com");
    if (isPageComplete && isYoutube) chrome.tabs.sendMessage(tabId, { message: "YT_PAGE_LOADED" });
});
