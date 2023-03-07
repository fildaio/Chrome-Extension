import multiSigWalletWithDailyLimit from "../assets/abis/MultiSigWalletWithDailyLimit.json"

export const safeController = {
	_web3: null,
	_contracts: null,
	_pagingCount: 5,
	_indexOfPaging: 0,
	_transactions: null,

	init: function (web3) {
		this._indexOfPaging = 0;
		this._transactions = null;
		this._web3 = web3;

		if (this._contracts) {
			this._contracts.clear();
		}
		this._contracts = new Map();
	},

	isOwner: async function (safe, account, callback) {
		// console.debug("检查地址是不是多签钱包 参数:", safe, account, this._web3);

		// const safeContract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit.abi, safe);
		// try {
		// 	const isOwner = await safeContract.methods.isOwner(account ?? this._web3.currentProvider.selectedAddress).call();
		// 	console.debug("检查地址是不是多签钱包", safe, account ?? this._web3.currentProvider.selectedAddress, isOwner);
		// 	return callback(isOwner);
		// } catch (error) {
		// 	console.error(error);
		// 	return callback(false);
		// }

		return callback(true);
	},

	// deploy: function (owners, required, dailyLimit, account, callback) {
	// 	const safeContract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit.abi);
	// 	safeContract.deploy({
	// 		data: multiSigWalletWithDailyLimit.bytecode,
	// 		arguments: [owners, required, dailyLimit]
	// 	}).send({
	// 		from: account,
	// 		// gas: 1500000,
	// 		// gasPrice: '30000000000000'
	// 	}).then(function (newContractInstance) {
	// 		return callback(newContractInstance.options.address)
	// 	});
	// }

	getTransactions: function (safe, callback) {
		this._getContract(safe).methods.getTransactionCount(true, true).call(null, (error, result) => {
			if (error) {
				return console.error(error);
			}

			if (callback && result) {
				const howMany = parseInt(result);
				this._transactions = new Array(howMany);
				this._indexOfPaging = 0;
				return callback(howMany);
			}
		});
	},

	getPagingTransactions: async function (safe) {
		const count = this._transactions.length;
		const from = count - this._indexOfPaging * this._pagingCount - 1;
		let i = 0;

		do {
			const theIdx = from - i;
			i++;

			if (theIdx >= 0) {
				const result = await this.getTransactionById(safe, theIdx);
				if (result) {
					this._transactions[theIdx] = result;
				}
			}
		} while (i < this._pagingCount);

		this._indexOfPaging++;

		return this._transactions.reverse();
	},

	getTransactionById: async function (safe, transactionId) {
		try {
			const res = await this._getContract(safe).methods.transactions(transactionId).call();
			res.id = transactionId;
			return res;
		} catch (error) {
			console.error(error);
		}
	},

	_getContract: function (contractAddress) {
		let contract = null;

		if (this._contracts.has(contractAddress)) {
			contract = this._contracts.get(contractAddress);
		} else {
			contract = new this._web3.eth.Contract(multiSigWalletWithDailyLimit.abi, contractAddress);
			this._contracts.set(contractAddress, contract);
		}

		return contract;
	}
};