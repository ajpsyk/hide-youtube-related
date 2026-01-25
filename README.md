# Hide YouTube Related Column

A lightweight Chrome Extension built with Manifest V3 that adds a native-feeling toggle button to the YouTube sidebar.
It allows users to hide the "Related Videos" section for a distraction-free experience.

## Features

* **State Persistence**: Remembers if you left the sidebar hidden or visible, even after refreshing the page.
* **SPA Support**: Works seamlessly with YouTube's "Single Page Application" navigation (no-refresh video switching).
* **Lightweight**: Zero dependencies; uses native Chrome APIs.

## Installation

1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode using the toggle in the top right corner.
4. Click Load unpacked in the top left of the extensions page and select the folder containing the extension files.

## Project Structure

* **manifest.json**: Extension configuration and permissions.
* **background.js**: Monitors tab updates and URL changes to trigger the content script.
* **contentScript.js**: Handles DOM injection, button logic, and theme styling.
* **assets/**: Contains the button icons.

## How it Works

The extension uses a service_worker to watch for chrome.tabs.onUpdated. When it detects a youtube.com/watch URL, it pings the content script. The content script then:

1. Checks chrome.storage.local for the user's last preference.
2. Injects a button into the #secondary column.
3. Toggles the #related element visibility without affecting the #playlist element.
