// console.log(window);
// var elt = document.createElement("script");
// // elt.setAttribute('type', 'text/javascript');
// console.log(chrome.runtime.getURL("scripts/test.js"));
// elt.src = chrome.runtime.getURL("scripts/test.js");
// document.head.appendChild(elt);

import { globalUtils } from "./libs/globalUtils";

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
// 	}, 3000);
// };

// foo();

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === globalUtils.constants.SHOW_ADD_VIEW) {
			// <link rel="stylesheet" type="text/css" href="https://cdn.sstatic.net/Shared/stacks.css?v=70e4dd648d48">
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = chrome.runtime.getURL("styles/for_dapp.css");
			document.head.appendChild(link);

			const el = document.createElement("script");
			el.id = globalUtils.constants.SHOW_ADD_VIEW;
			el.className = sender.id;
			el.src = chrome.runtime.getURL("scripts/add.js");
			document.body.appendChild(el);
		}

		// console.log(request, sender, sendResponse);
		if (request.message === globalUtils.messages.CONNECT_MULTISIG_WALLET) {
			const el = document.createElement("script");
			el.id = globalUtils.messages.CONNECT_MULTISIG_WALLET;
			el.className = request.data.address;
			el.src = chrome.runtime.getURL("scripts/inject.js");
			document.head.appendChild(el);
		}
	}
);

// chrome.runtime.onMessageExternal.addListener(
// 	function (request, sender, sendResponse) {
// 		console.log(request, sender, sendResponse);
// 		// if (sender.url === blocklistedWebsite)
// 		//   return;  // don't allow this web page access
// 		// if (request.openUrlInEditor)
// 		//   openUrl(request.openUrlInEditor);
// 	}
// );

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
// 	console.log(response.farewell);
// });

// const port = chrome.runtime.connect();

// window.addEventListener("message", function (event) {
// 	console.log(event);
// 	// if (event.source != window)
// 	// 	return;

// 	// if (event.data.type && (event.data.type == "FROM_PAGE")) {
// 	// 	console.log("Content script received: " + event.data.text, event.data.w);
// 	// 	port.postMessage(event.data.text);
// 	// }
// }, false);

// window.onload = () => {
// 	// window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!", w: window }, "*");
// 	const el = document.createElement("script");
// 	el.src = chrome.runtime.getURL("scripts/inject.js");
// 	document.head.appendChild(el);
// };