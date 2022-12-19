import en from "../../public/locales/en.json";
import { globalUtils } from "./globalUtils";

export const jesus = {
	_localeStrings: en,

	_walletConnected: globalUtils.WalletConnected.IDLE,
	get walletConnected() {
		return this._walletConnected;
	},

	init: function () {
		this._walletConnected = this._getWalletConnected();
	},

	getLocaleString: function (key) {
		return this._localeStrings[key];
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