const { globalUtils } = require("./libs/globalUtils");
const { safeProvider } = require("./libs/safeProvider");

const tagInjected = document.getElementById(globalUtils.messages.CONNECT_MULTISIG_WALLET);
const walletAddress = tagInjected.dataset.walletAddress;
const fromTab = tagInjected.dataset.tab;
const extensionId = tagInjected.dataset.extensionId;

const inject = () => {
	const originEthereum = window.ethereum;
	const newProvider = safeProvider.init(originEthereum);
	newProvider.safeAddress = walletAddress;
	window.ethereum = newProvider;
	window.alert("注入成功！");
};

const reload = () => {
	window.location.reload();
};

const checkProvider = () => {
	chrome.runtime.sendMessage(extensionId, {
		message: globalUtils.messages.CHECK_PROVIDER_OPTIONS,
		data: { url: window.location.origin }
	}, null, response => {
		console.debug("checkProvider的回调", response);

		if (response) {
			if (window.confirm("是否确定在本网站上使用多签钱包插件进行交易？\n\n可能需要您在dapp上重新连接Metamask。")) {
				inject();
			}
		} else {
			if (window.confirm("是否想要在本网站上使用多签钱包插件进行交易？")) {
				chrome.runtime.sendMessage(extensionId, {
					message: globalUtils.messages.SAVE_LOCAL_STORAGE,
					data: {
						url: window.location.origin,
						value: true
					}
				}, null, res => {
					if (res) {
						inject();
					}
				});
			}
		}
	});
};

const listen = () => {
	const port = window.chrome.runtime.connect(extensionId);
	// const port = window.chrome.runtime.connect({ name: globalUtils.constants.WEB_2_EXTENSION });
	// port.postMessage("芝麻开门！");
	port.onMessage.addListener(function (msg) {
		if (msg.message === globalUtils.messages.SELECT_MULTISIG_PROVIDER) {
			// console.debug("准备注入：", msg);
			if (msg.data) {
				checkProvider();
			} else {
				reload();
			}
		}
	});
	// console.debug("开始监听了……");
};

const main = _ => {
	if (window.ethereum) {
		listen();
	} else {
		console.warn("没有window.ethereum");
	}
};

main();