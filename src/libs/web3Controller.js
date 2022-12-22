import Web3 from "web3";
import { globalUtils } from "./globalUtils";

export const web3Controller = {
	_web3: null,
	_provider: null,
	_account: "",

	initWithRpc: async function (rpc, callback) {
		this._web3 = new Web3(rpc);

		callback({
			web3: this._web3,
			provider: this._web3.currentProvider
		});
	},

	connect: async function (walletTitle, provider, callback) {
		if (walletTitle === globalUtils.WalletTitle.METAMASK && provider && callback) {
			this._provider = provider
			this._web3 = new Web3(this._provider);

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			this._account = accounts[0];

			callback({
				web3: this._web3,
				provider: this._provider,
				account: this._account
			});
		}
	},

	isAddress: function (addr) {
		return this._web3?.utils.isAddress(addr);
	},

	getBalance: function (addr, callback) {
		this._web3.eth.getBalance(addr).then(callback);
	}
};