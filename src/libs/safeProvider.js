// export const safeProvider = {
// 	_originProvider: null,

// 	init: function (provider) {
// 		if (provider) {
// 			this._originProvider = provider;
// 		}

// 		return this;
// 	}
// };

import Web3 from "web3";
import multiSigWalletWithDailyLimit from "../assets/abis/MultiSigWalletWithDailyLimit.json"

export const safeProvider = {
	safeAddress: "",
	owner: "",
	_originProvider: null,
	_originWeb3: null,
	_gasLimit: 0,

	init: function (provider) {
		this._originProvider = provider;
		this._originWeb3 = new Web3(this._originProvider);
		this.getAccount();
		return this;
	},

	getAccount: async function () {
		const accounts = await this._originProvider.request({ method: 'eth_requestAccounts' });
		this.owner = accounts[0];
	},

	send: function (payload) {
		return this._originProvider.send(payload);
	},

	sendAsync: async function (payload) {
		await this._originProvider.sendAsync(payload);
	},

	request: async function (payload) {
		// console.debug("方法", payload.method);

		if (payload.method === "eth_requestAccounts" || payload.method === "eth_accounts") {
			return new Promise((resolve, reject) => {
				resolve([this.safeAddress]);
			});
		}

		if (
			payload.method === "eth_sendTransaction" &&
			payload.params &&
			payload.params[0].from.toLocaleLowerCase() === this.safeAddress.toLocaleLowerCase()
		) {
			const params = payload.params[0];
			const theContract = new this._originWeb3.eth.Contract(multiSigWalletWithDailyLimit, this.safeAddress);
			const contractFunc = theContract.methods.submitTransaction(
				params.to,
				params.value ?? 0,
				params.data
			)

			params.data = contractFunc.encodeABI();
			params.from = this.owner;
			params.to = this._originWeb3.utils.toChecksumAddress(this.safeAddress);
			params.value = 0;
			params.gas = await this._getGasLimit();
			// console.debug(params);
		}

		return await this._originProvider.request(payload);
	},

	on: function (eventKey, handler) {
		if (
			eventKey === "accountsChanged"
			// eventKey === "connect"
			// || eventKey === "message"
			// || eventKey === "data"
			// || eventKey === "error"
			// || eventKey === "disconnect"
			// || eventKey === "chainChanged"
			// || eventKey === "close"
			// || eventKey === "networkChanged"
		) {
			return handler([this.safeAddress]);
		}

		return this._originProvider.on(eventKey, handler);
	},

	_getGasLimit: async function () {
		if (this._gasLimit === 0 && this._originWeb3) {
			// this._gasLimit = this._originWeb3.utils.toHex(await FetchData.getGasLimit(this._originWeb3));
		}

		return this._gasLimit;
	}
};