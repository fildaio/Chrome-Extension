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

const main = _ => {
	if (window.ethereum) {
		chrome.runtime.sendMessage(extensionId, {
			message: globalUtils.messages.CHECK_PROVIDER_OPTIONS,
			data: { url: window.location.origin }
		}, null, response => {
			if (response) {
				if (window.confirm("是否确定在本网站上使用多签钱包插件进行交易？")) {
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
	} else {
		console.warn("没有window.ethereum");
	}
};

main();