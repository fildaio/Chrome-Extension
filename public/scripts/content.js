// console.log(window);
// var elt = document.createElement("script");
// // elt.setAttribute('type', 'text/javascript');
// console.log(chrome.runtime.getURL("scripts/test.js"));
// elt.src = chrome.runtime.getURL("scripts/test.js");
// document.head.appendChild(elt);

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

// chrome.runtime.onMessage.addListener(
// 	function (request, sender, sendResponse) {
// 		console.log(sender.tab ?
// 			"from a content script:" + sender.tab.url :
// 			"from the extension");
// 		if (request.greeting === "hello")
// 			sendResponse({ farewell: "goodbye" });
// 	}
// );

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
// 	console.log(response.farewell);
// });

// const port = chrome.runtime.connect();

// window.addEventListener("message", function (event) {
// 	// We only accept messages from ourselves
// 	if (event.source != window)
// 		return;

// 	if (event.data.type && (event.data.type == "FROM_PAGE")) {
// 		console.log("Content script received: " + event.data.text, event.data.w);
// 		port.postMessage(event.data.text);
// 	}
// }, false);
window.onload = () => {
	// window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!", w: window }, "*");
	const el = document.createElement("script");
	el.src = chrome.runtime.getURL("scripts/index.js");
	document.head.appendChild(el);
};