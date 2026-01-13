(() => {
    let hideRelatedBtn;

    chrome.runtime.onMessage.addListener((obj) => {
        if (obj.message === "TAB_UPDATE") {
            newVideoLoaded();
        }
    });

    const newVideoLoaded = () => {
        let btn = document.querySelector(".hide-related-btn");
        if (!btn) {
            const secondary = document.querySelector("ytd-watch-flexy #secondary");
            if (!secondary) {
                setTimeout(newVideoLoaded, 500);
                return;
            }

            hideRelatedBtn = document.createElement("button");
            hideRelatedBtn.classList.add(
                "yt-spec-button-shape-next",
                "yt-spec-button-shape-next--tonal",
                "yt-spec-button-shape-next--mono",
                "yt-spec-button-shape-next--size-m",
                "yt-spec-button-shape-next--icon-button",
                "hide-related-btn"
            );
            hideRelatedBtn.title = "Click to hide related content.";
            hideRelatedBtn.style.marginBottom = "10px"; 

            const img = document.createElement("img");
            img.src = chrome.runtime.getURL("assets/visibility.svg");

            hideRelatedBtn.appendChild(img);

            chrome.storage.local.get("btnIsHidden", (data) => {
                const related = document.getElementById("related");
                related.hidden = data.btnIsHidden || false;
                updateButtonIcon(related.hidden);
            });

            secondary.prepend(hideRelatedBtn);
            
            hideRelatedBtn.addEventListener("click", hideRelatedBtnEventHandler);
        }
    }

    const hideRelatedBtnEventHandler = () => {
        const related = document.getElementById("related");
        const isHidden = !related.hidden;

        related.hidden = isHidden;
        chrome.storage.local.set({"btnIsHidden": isHidden});
        updateButtonIcon(isHidden);
    }

    const updateButtonIcon = (isHidden) => {
        const buttonImg = hideRelatedBtn.querySelector("img");
        buttonImg.src = chrome.runtime.getURL(
            isHidden ? "assets/visibility_off.svg" : "assets/visibility.svg"
        );
    }

    newVideoLoaded();
    
})();
