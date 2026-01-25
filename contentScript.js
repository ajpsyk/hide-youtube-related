(() => {

    chrome.runtime.onMessage.addListener((obj) => {
        if (obj.message === "YT_PAGE_LOADED") youtubePageLoaded(obj.url);
    });

    const youtubePageLoaded = async (url) => {

        await waitForElement("ytd-masthead #center");
        await waitForElement("ytd-watch-flexy #secondary");

        const buttonExists = document.querySelector("#hide-related-button");
        !buttonExists ? createButton() : updatePageState();
    
    }

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve();

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
        console.log("There is no button. Creating button...");
        
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
       
        updatePageState();
    }

    const updatePageState = () => {
        console.log(`Button is created. Getting page state.`);
        chrome.storage.local.get("btnIsHidden", (data) => {
            data.btnIsHidden === undefined ? console.log("Button state not set. Defaulting to visible state.") : console.log("Related is visible: ", !data.btnIsHidden);
            const related = document.getElementById("related");
            const isHidden = data.btnIsHidden || false;
            related.hidden = isHidden;
            chrome.storage.local.set({"btnIsHidden": isHidden});
            updateButtonIcon(isHidden);
        });
    }

    const hideRelatedEventHandler = () => {
        const related = document.getElementById("related");
        const isHidden = !related.hidden;
        console.log("Button Clicked!")

        if (isHidden) {
            console.log("Hiding related content.");
        } else {
            console.log("Showing related content")
        }

        related.hidden = isHidden;
        chrome.storage.local.set({"btnIsHidden": isHidden});
        updateButtonIcon(isHidden);
    }

    const updateButtonIcon = (isHidden) => {
        if (isHidden) {
            console.log("Button using visibility off icon.");
        } else {
            console.log("Button using visibility on icon.")
        }
        const buttonImg = document.querySelector("#hide-related-button").querySelector("img");
        buttonImg.src = chrome.runtime.getURL(
            isHidden ? "assets/visibility_off.svg" : "assets/visibility.svg"
        );
    }

    chrome.runtime.sendMessage("SCRIPTS_LOADED");
})();
