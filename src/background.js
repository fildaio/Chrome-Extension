import { config } from "./libs/config";
import { globalUtils } from "./libs/globalUtils";
import { god } from "./libs/god";

let thePort = null;

chrome.runtime.onMessageExternal.addListener(
	function (request, sender, sendResponse) {
		console.debug(request, sender, sendResponse);

		if (request.message === globalUtils.messages.RESTORED) {
			god.pushWallet(request.data.name, request.data.address, sendResponse);
		}

		if (request.message === globalUtils.messages.CHECK_PROVIDER_OPTIONS) {
			god.setItemInLocalStorage(globalUtils.constants.CURRENT_TAB_URL, request.data.url);
			console.debug("写入了god.currentTabUrl", god.currentTabUrl);

			god.getItemFromLocalStorage(globalUtils.constants.PROVIDER_SELECTED, providers => {
				console.debug("读取了已存储的记录", providers);

				sendResponse(providers[request.data.url]);
			});
		}

		if (request.message === globalUtils.messages.SEND_DATA_FROM_WALLET_WEBSITE) {
			console.debug("从网站上读到了wallets值：", request.data);
			god.pushWallets(Object.values(JSON.parse(request.data)));
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

chrome.runtime.onConnectExternal.addListener(function (port) {
	thePort = port;
	console.debug("建立连接，并注册连接", thePort);

	// thePort.onMessage.addListener(function (msg) {
	// 	console.debug("听到有人叫门", msg);
	// });
});

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		// if (request.message === globalUtils.messages.SELECT_MULTISIG_PROVIDER && thePort) {
		if (request.message === globalUtils.messages.SELECT_MULTISIG_PROVIDER) {
			// thePort.postMessage({
			// 	message: globalUtils.messages.SELECT_MULTISIG_PROVIDER,
			// 	data: request.data
			// });
		}
	}
);

chrome.tabs.onActivated.addListener(async activeInfo => {
	console.debug("onActivated事件 activeInfo =", activeInfo);

	await chrome.storage.local.set({ tabId: activeInfo.tabId })

	chrome.tabs.get(activeInfo.tabId, tab => {
		console.debug("onActivated事件 检测tab =", tab);

		if (tab && tab.url.indexOf(config.walletWebSite.root) < 0 && tab.pendingUrl?.indexOf(config.walletWebSite.root) < 0) {
			console.debug("onActivated事件 准备注入");

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
		}
	});
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	console.debug("onUpdated事件 tab =", tab, changeInfo);

	await chrome.storage.local.set({ tabId: tabId })

	if (changeInfo.status === 'complete' && tab.url.indexOf(config.walletWebSite.root) < 0) {
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

	if (changeInfo.status === 'complete' && tab.url.indexOf(config.walletWebSite.root) === 0) {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			func: () => {
				const el = document.createElement("script");
				el.id = "walletWebsiteTab";
				el.dataset.extensionId = chrome.runtime.id;
				// el.dataset.tab = tabId; // 上下文中tabId没有值……
				el.src = chrome.runtime.getURL("scripts/add.js");
				return document.head.appendChild(el);
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