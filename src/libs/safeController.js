import multiSigWalletWithDailyLimit from "../assets/abis/MultiSigWalletWithDailyLimit.json"

export const safeController = {
	_web3: null,
	_safes: null,

	init: function (web3) {
		this._web3 = web3;
		this._safes = new Map();
	},

	isOwner: async function (safe, account, callback) {
		const safeContract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit, safe);
		try {
			const isOwner = await safeContract.methods.isOwner(account).call();
			return callback(isOwner);
		} catch (error) {
			return callback(false);
		}
	}
};