// const foo = () => {
// 	setTimeout(() => {
// 		window.ethereum = {
// 			request: function (arg) {
// 				console.log(arg);
// 			},
// 			enable: function () {
// 				console.log("开妈了。");
// 			}
// 		};
// 		console.log(window);
// 	}, 1000);
// };

import { globalUtils } from "./libs/globalUtils";
import { god } from "./libs/god";

// foo();

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

// chrome.runtime.onMessage.addListener(
// 	function (request, sender, sendResponse) {
// 		console.log("接收到消息", request, sender, sendResponse);

// 		console.log(sender.tab ?
// 			"from a content script:" + sender.tab.url :
// 			"from the extension", request);
// 		if (request.greeting === "hello")
// 			sendResponse({ farewell: "接收到了content发来的消息" });
// 	}
// );

// chrome.action.onClicked.addListener(tab => {
// 	console.log(tab);

// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		files: ['scripts/exec.js']
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