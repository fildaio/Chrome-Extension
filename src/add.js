import React from "react";
// import ReactDOM from "react-dom";
import { globalUtils } from "./libs/globalUtils";
// import { AddView } from "./views/AddView";

const tagInjected = document.getElementById(globalUtils.constants.WALLET_WEBSITE_TAB);
const extensionId = tagInjected.dataset.extensionId;

const main = () => {
	// const div = document.createElement("div");
	// div.style = "width: 100vw; height: 100vh; position: absolute; left: 0; top: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;"
	// document.body.appendChild(div);

	// const closeModal = () => {
	// 	ReactDOM.unmountComponentAtNode(div);
	// 	document.body.removeChild(div);
	// };

	// const theView = <AddView onClose={closeModal} />

	// ReactDOM.render(theView, div);

	const wallets = window.localStorage.getItem("wallets");
	chrome.runtime.sendMessage(extensionId, {
		message: globalUtils.messages.SEND_DATA_FROM_WALLET_WEBSITE,
		data: wallets
	});
};

main();