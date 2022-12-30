import multiSigWalletWithDailyLimit from "../assets/abis/MultiSigWalletWithDailyLimit.json"

export const safeController = {
	_web3: null,

	init: function (web3) {
		this._web3 = web3;
	},

	isOwner: async function (safe, account, callback) {
		// const safeContract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit.abi, safe);
		// try {
		// 	const isOwner = await safeContract.methods.isOwner(account).call();
		// 	return callback(isOwner);
		// } catch (error) {
		// 	console.error(error);
		// 	return callback(false);
		// }
		return callback(true);
	},

	deploy: function (owners, required, dailyLimit, account, callback) {
		const safeContract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit.abi);
		safeContract.deploy({
			data: multiSigWalletWithDailyLimit.bytecode,
			arguments: [owners, required, dailyLimit]
		}).send({
			from: account,
			// gas: 1500000,
			// gasPrice: '30000000000000'
		}).then(function (newContractInstance) {
			return callback(newContractInstance.options.address)
		});
	}
};