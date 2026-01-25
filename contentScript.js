(() => {

    chrome.runtime.onMessage.addListener((obj) => {
        if (obj.message === "YT_PAGE_LOADED") youtubePageLoaded();
        if (obj.message === "YT_PAGE_ACTIVE") youtubePageActive();
    });

    const youtubePageLoaded = async () => {
        console.log("Detected Loaded youtube page. Updating");
        await waitForElement("ytd-masthead #center");
        await waitForElement("ytd-watch-flexy #secondary");

        const buttonExists = document.querySelector("#hide-related-button");
        if (!buttonExists) createButton();
        updatePageState();
    }

    const youtubePageActive = () => {
        console.log("Detected Active youtube page. Updating");
        updatePageState();
    }

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve();
            console.log(`Waiting for ${selector}...`)

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve();
                    observer.disconnect(); 
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    const createButton = () => {
        console.log(`Creating button`);
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "hide-related-button";
        buttonContainer.classList.add(
            "style-scope", "ytd-masthead"
        );
        buttonContainer.style.marginLeft = "12px";
        buttonContainer.addEventListener("click", hideRelatedEventHandler);

        const button = document.createElement("button");
        button.classList.add(
            "yt-spec-button-shape-next",
            "yt-spec-button-shape-next--text",
            "yt-spec-button-shape-next--mono",
            "yt-spec-button-shape-next--tonal",
            "yt-spec-button-shape-next--size-m", 
            "yt-spec-button-shape-next--icon-only-default",
            "yt-spec-button-shape-next--enable-backdrop-filter-experiment"
        );
        button.ariaLabel = "Hide related content";
        button.ariaDisabled = "false";
        buttonContainer.appendChild(button);

        const img = document.createElement("img");
        button.appendChild(img);

        const mastheadCenter = document.querySelector("ytd-masthead #center");
        mastheadCenter.appendChild(buttonContainer);
       
    }

    const updatePageState = () => {
        chrome.storage.local.get("relatedHidden", (data) => {
            console.log(`Fetching page state. Page state is ${data.relatedHidden}`)
            const relatedHidden = data.relatedHidden ?? false;
            updateRelated(relatedHidden);
        });
    }

    const hideRelatedEventHandler = () => {
        updateRelated();
    }

    const updateRelated = (relatedHidden) => {
        const related = document.getElementById("related");
        const isHidden = relatedHidden ?? !related.hidden;
        console.log(`Updating related. Related is visible: ${!isHidden}`);
        related.hidden = isHidden;
        chrome.storage.local.set({"relatedHidden": isHidden});
        updateButtonIcon(isHidden);
    }

    const updateButtonIcon = (isHidden) => {
        console.log(`Button is visibility on: ${!isHidden}`)
        const buttonImg = document.querySelector("#hide-related-button").querySelector("img");
        buttonImg.src = chrome.runtime.getURL(
            isHidden ? "assets/visibility_off.svg" : "assets/visibility.svg"
        );
    }

})();
