import { globalUtils } from "./globalUtils";
import en from "../../public/locales/en.json";
import ReactDOM from "react-dom";

export const god = {
	_initiated: false,
	_localeStrings: en,

	_walletConnected: globalUtils.WalletConnected.IDLE,
	get walletConnected() {
		return this._walletConnected;
	},

	_wallets: [],
	get wallets() {
		return this._wallets;
	},

	_gettingWalletsFunc: null,

	init: function (gettingWalletsFunc) {
		if (!this._initiated) {
			this._gettingWalletsFunc = gettingWalletsFunc;
			this._wallets = this._getWalletsFromStorage();
			this._walletConnected = this._getWalletConnected();
		}
	},

	getLocaleString: function (key) {
		return en[key];
	},

	openAddView: async function () {
		// chrome.tabs.create({
		// 	url: 'pages/add.html'
		// });
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		// const response = await chrome.tabs.sendMessage(tab.id, { message: globalUtils.constants.SHOW_ADD_VIEW });
		await chrome.tabs.sendMessage(tab.id, { message: globalUtils.constants.SHOW_ADD_VIEW });
		// console.log(response);
	},

	openModal: function (modal) {
		ReactDOM.render(modal, document.getElementById("modalContainer"));
	},

	pushWallet: function (name, address, callback) {
		if (this._wallets.findIndex(item => item.name === name) < 0) {
			this._wallets.push({
				name,
				address
			});
			// window.localStorage.setItem(globalUtils.constants.WALLETS, JSON.stringify(this._wallets));
			chrome.storage.local.set({ wallets: JSON.stringify(this._wallets) }).then(() => {
				return callback();
			});
		}
	},

	connectCurrentWallet: async function (walletObj) {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		await chrome.tabs.sendMessage(tab.id, {
			message: globalUtils.messages.CONNECT_MULTISIG_WALLET,
			data: walletObj
		});
	},

	saveCurrentWallet: function (walletObj, callback) {
		chrome.storage.local.set({ currentWallet: JSON.stringify(walletObj) }).then(_ => {
			if (callback) callback();
		});
	},

	_getWalletsFromStorage: function () {
		// const result = window.localStorage.getItem(globalUtils.constants.WALLETS);
		// if (result) {
		// 	try {
		// 		return JSON.parse(result);
		// 	} catch (error) {
		// 		console.error(error);
		// 		return [];
		// 	}
		// } else {
		// 	return [];
		// }

		chrome.storage.local.get(["wallets"]).then(result => {
			if (result && this._gettingWalletsFunc) {
				this._wallets = JSON.parse(result.wallets);
				this._gettingWalletsFunc(this._wallets);
			}
		});
	},

	_getWalletConnected: function () {
		const result = window.localStorage.getItem(globalUtils.constants.WALLET_CONNECTED);
		if (result) {
			return parseInt(result);
		} else {
			return globalUtils.WalletConnected.IDLE;
		}
	}
};