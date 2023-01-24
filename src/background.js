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
		console.debug(request, sender, sendResponse);

		if (request.message === globalUtils.messages.RESTORED) {
			god.pushWallet(request.data.name, request.data.address, sendResponse);
		}

		if (request.message === globalUtils.messages.CHECK_PROVIDER_OPTIONS) {
			// chrome.runtime.openOptionsPage(() => {
			// 	return sendResponse({ a: 1 });
			// });
			god.getItemFromLocalStorage(globalUtils.constants.PROVIDER_SELECTED, providers => {
				sendResponse(providers[request.data.url]);
			});
		}


		if (request.message === globalUtils.messages.SAVE_LOCAL_STORAGE) {
			const toSave = {};
			toSave[request.data.url] = request.data.value;
			god.setItemInLocalStorage(globalUtils.constants.PROVIDER_SELECTED, toSave, success => {
				sendResponse(success);
			});
		}

		return true;
	}
);

chrome.tabs.onActivated.addListener(async activeInfo => {
	console.debug("activeInfo =", activeInfo);

	await chrome.storage.local.set({ tabId: activeInfo.tabId })

	chrome.scripting.executeScript({
		target: { tabId: activeInfo.tabId },
		func: () => {
			chrome.storage.local.get(["currentWallet"]).then(async result => {
				if (result) {
					const addr = JSON.parse(result.currentWallet).address;
					const fromTab = (await chrome.storage.local.get(["tabId"])).tabId;

					if (addr) {
						const tagId = "connectMultisigWallet";
						const tag = document.getElementById(tagId);
						if (tag) {
							tag.dataset.walletAddress = addr;
							tag.dataset.tab = fromTab;
							tag.dataset.extensionId = chrome.runtime.id;
						} else {
							const el = document.createElement("script");
							el.id = tagId;
							el.dataset.walletAddress = addr;
							el.dataset.tab = fromTab;
							el.dataset.extensionId = chrome.runtime.id;
							el.src = chrome.runtime.getURL("scripts/inject.js");
							return document.head.appendChild(el);
						}
					}
				}
			});
		}
	});
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	console.debug("tabId, changeInfo, tab =", tabId, changeInfo, tab);

	await chrome.storage.local.set({ tabId: tabId })

	if (changeInfo.status === 'complete') {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			func: () => {
				chrome.storage.local.get(["currentWallet"]).then(async result => {
					if (result) {
						const fromTab = (await chrome.storage.local.get(["tabId"])).tabId;
						const addr = JSON.parse(result.currentWallet).address;

						if (addr) {
							const tagId = "connectMultisigWallet";
							const tag = document.getElementById(tagId);
							if (tag) {
								tag.dataset.walletAddress = addr;
								tag.dataset.tab = fromTab;
								tag.dataset.extensionId = chrome.runtime.id;
							} else {
								const el = document.createElement("script");
								el.id = tagId;
								el.dataset.walletAddress = addr;
								el.dataset.tab = fromTab;
								el.dataset.extensionId = chrome.runtime.id;
								el.src = chrome.runtime.getURL("scripts/inject.js");
								return document.head.appendChild(el);
							}
						}
					}
				});
			}
		});
	}
});

// const main = () => {
// 	setTimeout(() => {
// 		console.log("chrome:", chrome);
// 		console.log("chrome.action:", chrome.action);
// 	}, 3000);
// };

// main();