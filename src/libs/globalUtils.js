import BigNumber from "bignumber.js";

export const globalUtils = {
	constants: {
		APP_TITLE: "Filda Multisig Wallet",
		WALLETS: "wallets",
		WALLET_CONNECTED: "walletConnected",
		SHOW_ADD_VIEW: "showAddView",
		ADD_OPTIONS: "addOptions",
		CURRENCY_SYMBOL: "ELA",
		ZERO_BN: BigNumber(0)
	},
	currency: {
		decimals: 18,
		symbol: "ELA",
		fraction: 4
	},
	web3: {
		rpc: "https://api.elastos.io/eth"
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
	stringShorten: function (str, len, lenBehind = 0) {
		if (lenBehind > 0) {
			return str.substr(0, len) + "..." + str.substr(str.length - lenBehind, lenBehind);
		} else {
			return str.substr(0, len);
		}
	},
	formatBigNumber: function (bn, decimals, fraction = 0, returnString = false) {
		const val = bn.shiftedBy(-decimals);
		if (returnString) {
			return val.toFixed(fraction);
		} else if (fraction > 0) {
			return Number(val.toFixed(fraction));
		} else {
			return val.toNumber();
		}
	}
};