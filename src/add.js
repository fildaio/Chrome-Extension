import md5 from "blueimp-md5";
import React from "react";
// import ReactDOM from "react-dom";
import { globalUtils } from "./libs/globalUtils";
// import { AddView } from "./views/AddView";

const tagInjected = document.getElementById(globalUtils.constants.WALLET_WEBSITE_TAB);
const extensionId = tagInjected.dataset.extensionId;

let previousDataMD5 = null;
let loadDataTimer = null;

const loadLocalStorage = () => {
	const newData = window.localStorage.getItem("wallets");
	const newDataMD5 = md5(newData);
	if (previousDataMD5 != newDataMD5) {
		previousDataMD5 = newDataMD5;
		return newData;
	} else {
		return null;
	}
}

const main = () => {
	if (loadDataTimer) {
		clearInterval(loadDataTimer);
		loadDataTimer = null;
	}

	loadDataTimer = setInterval(() => {
		const wallets = loadLocalStorage();
		if (wallets) {
			chrome.runtime.sendMessage(extensionId, {
				message: globalUtils.messages.SEND_DATA_FROM_WALLET_WEBSITE,
				data: wallets
			});
		}
	}, 10000);
};

main();