const { globalUtils } = require("./libs/globalUtils");
const { safeProvider } = require("./libs/safeProvider");

const tagInjected = document.getElementById(globalUtils.messages.CONNECT_MULTISIG_WALLET);
const walletAddress = tagInjected.dataset.walletAddress;
const fromTab = tagInjected.dataset.tab;
const extensionId = tagInjected.dataset.extensionId;

const checkEthereumEnv = () => {
	if (window.ethereum?.chainId === "0x14") {
		return true;
	} else {
		window.alert("The dapp has not connected to the ELA main network, or no wallets are connected.");
	}
};

const inject = () => {
	if (checkEthereumEnv()) {
		const originEthereum = window.ethereum;
		const newProvider = safeProvider.init(originEthereum);
		newProvider.safeAddress = walletAddress;
		window.ethereum = newProvider;
		// window.alert("注入成功！");
	}
};

// const reload = () => {
// 	window.location.reload();
// };

// const checkProvider = () => {
// 	chrome.runtime.sendMessage(extensionId, {
// 		message: globalUtils.messages.CHECK_PROVIDER_OPTIONS,
// 		data: { url: window.location.origin }
// 	}, null, response => {
// 		console.debug("checkProvider的回调", response);

// 		if (response) {
// 			if (window.confirm("是否确定在本网站上使用多签钱包插件进行交易？\n\n可能需要您在dapp上重新连接Metamask。")) {
// 				inject();
// 			}
// 		} else {
// 			if (window.confirm("是否想要在本网站上使用多签钱包插件进行交易？")) {
// 				chrome.runtime.sendMessage(extensionId, {
// 					message: globalUtils.messages.SAVE_LOCAL_STORAGE,
// 					data: {
// 						url: window.location.origin,
// 						value: true
// 					}
// 				}, null, res => {
// 					if (res) {
// 						inject();
// 					}
// 				});
// 			}
// 		}
// 	});
// };

const listen = () => {
	// const port = window.chrome.runtime.connect(extensionId);
	// port.onMessage.addListener(function (msg) {
	// 	if (msg.message === globalUtils.messages.SELECT_MULTISIG_PROVIDER) {
	// 		if (msg.data) {
	// 			checkProvider();
	// 		} else {
	// 			reload();
	// 		}
	// 	}
	// });

	window.addEventListener("message", event => {
		// if (event.data.message === globalUtils.messages.SELECT_MULTISIG_PROVIDER) {
		// 	// checkProvider();
		// }

		if (event.data.message === globalUtils.messages.CHECK_PROVIDER_OPTIONS) {
			console.debug("接收到了：当前网站使用多签provider吗？", event.data.useMultisigProvider);

			if (event.data.useMultisigProvider) {
				if (event.data.prompt) {
					if (window.confirm("Would you like to connect the multi-sig wallet built-in the browser extension? After that, you might have to re-connect the wallets(Metamask, and so on) in the dapp.")) inject();
				} else {
					inject()
				}
			}
		}
	});

	window.postMessage({
		message: globalUtils.messages.READY_FOR_LISTENING,
		url: window.location.origin,
		tab: fromTab
	});
};

const main = _ => {
	// if (window.ethereum) {
	// 	listen();
	// } else {
	// 	console.warn("没有window.ethereum");
	// }
	listen();
};

main();