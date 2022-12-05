const { safeProvider } = require("./libs/safeProvider");

const main = () => {
	if (window.ethereum) {
		window.fildaSafeProvider = safeProvider.init(window.ethereum);
	} else {
		console.log("没有provider");
	}
};

main();