// setInterval(() => {
// 	window.postMessage({ from: "dapp", data: Boolean(window.ethereum) });
// 	console.log("发了个消息")
// }, 3000);

// setTimeout(() => {
// 	chrome.runtime.sendMessage({
// 		greeting: "hello",
// 		data: Boolean(window.ethereum)
// 	}, function (response) {
// 		console.log(response.farewell);
// 	});

// 	window.postMessage({ type: "FROM_PAGE", data: Boolean(window.ethereum) });
// 	console.log("发了个消息")

// 	const el = document.createElement("script");
// 	el.src = chrome.runtime.getURL("/src/inject.js");
// 	document.head.appendChild(el);
// }, 3000);