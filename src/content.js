import { globalUtils } from "./libs/globalUtils";
import { god } from "./libs/god";

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.debug("content onMessage事件", request, sender, sendResponse);

		// if (request.message === globalUtils.constants.SHOW_ADD_VIEW) {
		// 	const link = document.createElement("link");
		// 	link.rel = "stylesheet";
		// 	link.type = "text/css";
		// 	link.href = chrome.runtime.getURL("styles/for_dapp.css");
		// 	document.head.appendChild(link);

		// 	const el = document.createElement("script");
		// 	el.id = globalUtils.constants.SHOW_ADD_VIEW;
		// 	el.className = sender.id;
		// 	el.src = chrome.runtime.getURL("scripts/add.js");
		// 	return document.body.appendChild(el);
		// }

		if (request.message === globalUtils.messages.CONNECT_MULTISIG_WALLET) {
			const el = document.createElement("script");
			el.id = globalUtils.messages.CONNECT_MULTISIG_WALLET;
			el.dataset.walletAddress = request.data.address;
			el.dataset.extensionId = sender.id;
			el.src = chrome.runtime.getURL("scripts/inject.js");
			return document.head.appendChild(el);
		}
	}
);

window.addEventListener("message", event => {
	if (event.data.message === globalUtils.messages.READY_FOR_LISTENING) {
		console.debug("接收到来自网页的window消息", event);

		god.setItemInLocalStorage(globalUtils.constants.CURRENT_TAB_URL, event.data.url);

		god.getItemFromLocalStorage(globalUtils.constants.PROVIDER_SELECTED, providers => {
			console.debug("读取了已存储的记录", providers, providers[event.data.url]);

			window.postMessage({
				message: globalUtils.messages.CHECK_PROVIDER_OPTIONS,
				useMultisigProvider: providers[event.data.url]
			}, event.origin);
		});
	}
});