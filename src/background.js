import { globalUtils } from "./libs/globalUtils";
import { god } from "./libs/god";

// chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
// 	console.log("badgeText =", badgeText);
// 	chrome.action.setBadgeText({ text: badgeText });
// });

// // Listener is registered on startup
// chrome.action.onClicked.addListener(evt => {
// 	console.log(evt);
// });
// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.contextMenus.create({
// 		"id": "sampleContextMenu",
// 		"title": "Sample Context Menu",
// 		"contexts": ["selection"]
// 	});
// });


chrome.runtime.onMessageExternal.addListener(
	function (request, sender, sendResponse) {
		// console.log(request, sender, sendResponse);
		if (request.message === globalUtils.messages.RESTORED) {
			god.pushWallet(request.data.name, request.data.address, sendResponse);
		}
	}
);

chrome.tabs.onActivated.addListener(activeInfo => {
	chrome.scripting.executeScript({
		target: { tabId: activeInfo.tabId },
		func: () => {
			chrome.storage.local.get(["currentWallet"]).then(result => {
				if (result) {
					const addr = JSON.parse(result.currentWallet).address;
					if (addr) {
						const tagId = "connectMultisigWallet";
						const tag = document.getElementById(tagId);
						if (tag) {
							return tag.className = addr;
						} else {
							const el = document.createElement("script");
							el.id = tagId;
							el.className = addr;
							el.src = chrome.runtime.getURL("scripts/inject.js");
							return document.head.appendChild(el);
						}
					}
				}
			});
		}
	});
});