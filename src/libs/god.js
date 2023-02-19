import { globalUtils } from "./globalUtils";
import en from "../../public/locales/en.json";
import ReactDOM from "react-dom";
import { config } from "./config";

export const god = {
	_initiated: false,
	_localeStrings: en,

	_wallets: [],
	get wallets() {
		return this._wallets;
	},

	_gettingWalletsFunc: null,

	init: function (gettingWalletsFunc) {
		if (!this._initiated) {
			this._gettingWalletsFunc = gettingWalletsFunc;
			this._wallets = this._getWalletsFromStorage();
			// this._walletConnected = this._getWalletConnected();
		}
	},

	getLocaleString: function (key) {
		return this._localeStrings[key];
	},

	syncFromWalletWebsite: function () {
		// const tab = await this.getCurrentTab();
		// await chrome.tabs.sendMessage(tab.id, { message: globalUtils.constants.SHOW_ADD_VIEW });
		chrome.tabs.create({
			active: false,
			url: config.walletWebSite.root + config.walletWebSite.wallets
		});
	},

	openModal: function (modal) {
		ReactDOM.render(modal, document.getElementById("modalContainer"));
	},

	closeModal: function () {
		ReactDOM.unmountComponentAtNode(document.getElementById("modalContainer"));
	},

	pushWallet: function (name, address, callback) {
		if (this._wallets.findIndex(item => item.name === name) < 0) {
			this._wallets.push({
				name,
				address
			});

			this.setItemInLocalStorage(
				globalUtils.constants.WALLETS,
				this._wallets,
				() => {
					this._gettingWalletsFunc(this._wallets);
					if (callback) callback();
					return;
				}
			);
		}
	},

	pushWallets: function (wallets, callback) {
		wallets.forEach(wallet => {
			this.pushWallet(wallet.name, wallet.address)
		});

		if (callback) {
			window.requestIdleCallback(callback);
		}
	},

	spliceWallet: function (index, callback) {
		this._wallets.splice(index, 1);
		this.setItemInLocalStorage(globalUtils.constants.WALLETS, this._wallets, () => {
			return callback(this._wallets);
		});
	},

	getCurrentTab: async function () {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		return tab;
	},

	connectCurrentWallet: async function (walletObj) {
		const tab = await this.getCurrentTab();
		if (tab.url.indexOf(config.walletWebSite.root) < 0) {
			chrome.tabs.sendMessage(tab.id, {
				message: globalUtils.messages.CONNECT_MULTISIG_WALLET,
				data: walletObj,
				tab: tab.id
			});
		}

		chrome.runtime.sendMessage(null, {
			message: globalUtils.messages.SELECTED_WALLET,
			data: walletObj
		});
	},

	saveCurrentWallet: function (walletObj, callback) {
		chrome.storage.local.set({ currentWallet: JSON.stringify(walletObj) }).then(_ => {
			if (callback) callback();
		});
	},

	loadCurrentWallet: function (callback) {
		chrome.storage.local.get(["currentWallet"]).then(result => {
			if (result && callback) {
				return callback(JSON.parse(result.currentWallet));
			}
		});
	},

	_getWalletsFromStorage: function () {
		this.getItemFromLocalStorage(globalUtils.constants.WALLETS, result => {
			console.debug("读取local存储 wallets =", result);

			if (result && this._gettingWalletsFunc) {
				try {
					this._wallets = JSON.parse(result);
				} catch (error) {
					console.error(error);
					this._wallets = result;
				}

				this._gettingWalletsFunc(this._wallets);
			}
		})
	},

	getItemFromLocalStorage: function (key, callback) {
		chrome.storage.local.get([key]).then(result => {
			if (result && result[key]) {
				return callback(JSON.parse(result[key]));
			} else {
				return callback("");
			}
		});
	},

	setItemInLocalStorage: function (key, value, callback) {
		const toSave = {};
		toSave[key] = JSON.stringify(value);

		try {
			chrome.storage.local.set(toSave).then(_ => {
				if (callback) {
					return callback(true);
				}
			});
		} catch (error) {
			console.error(error);

			if (callback) {
				return callback(false);
			}
		}
	}

	// _getWalletConnected: function () {
	// 	const result = window.localStorage.getItem(globalUtils.constants.WALLET_CONNECTED);
	// 	if (result) {
	// 		return parseInt(result);
	// 	} else {
	// 		return globalUtils.WalletConnected.IDLE;
	// 	}
	// }
};