export const globalUtils = {
	constants: {
		APP_TITLE: "Filda Multisig Wallet",
		WALLETS: "wallets",
		WALLET_CONNECTED: "walletConnected",
		SHOW_ADD_VIEW: "showAddView",
		ADD_OPTIONS: "addOptions",
		CURRENCY_SYMBOL: "ELA"
	},
	messages: {
		RESTORED: "restored",
		CONNECT_MULTISIG_WALLET: "connectMultisigWallet"
	},
	safeContractABI: "scripts/abis/MultiSigWalletWithDailyLimit.json",
	addTabs: [
		{
			id: "create",
			label: "createNewWallet",
			value: 0
		},
		{
			id: "restore",
			label: "restoreDeployedWallet",
			value: 1
		}
	],
	AddSteps: {
		IDLE: 0,
		CONNECT_WALLET: 1,
		ADD_OPTIONS: 2,
		CREAT: 3,
		RESTORE: 4
	},
	WalletConnected: {
		IDLE: 0,
		METAMASK: 1
	},
	WalletTitle: {
		METAMASK: 0,
		WALLETCONEECT: 1
	},
	loadJson: async function (url) {
		return await (await fetch(url)).json();
	},
	stringShorten: function (str, len) {
		return str.substr(0, len);
	}
};