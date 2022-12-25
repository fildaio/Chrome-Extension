const { globalUtils } = require("./libs/globalUtils");
const { safeProvider } = require("./libs/safeProvider");

const main = () => {
	const walletAddress = document.getElementById(globalUtils.messages.CONNECT_MULTISIG_WALLET).className;

	if (window.ethereum) {
		window.fildaSafeProvider = safeProvider.init(window.ethereum);
		window.fildaSafeProvider.safeAddress = walletAddress;
		// window.alert("注入成功！");
	} else {
		console.warn("没有window.ethereum");
	}
};

main();