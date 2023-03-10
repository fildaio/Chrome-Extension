import multiSigWalletWithDailyLimit from "../assets/abis/MultiSigWalletWithDailyLimit.json"
import { globalUtils } from "./globalUtils";
import { god } from "./god";

export const safeController = {
	_web3: null,
	_contracts: null,
	_pagingCount: 5,
	_indexOfPaging: 0,
	_transactions: null,
	_transactionCount: null,

	init: function (web3) {
		this._indexOfPaging = 0;
		this._web3 = web3;

		if (this._contracts) {
			this._contracts.clear();
			this._contracts = null;
		}
		this._contracts = new Map();

		if (this._transactions) {
			this._transactions = null;
		}
		this.loadTransactions();

		this._transactionCount = new Map();
	},

	loadTransactions: function () {
		god.getItemFromLocalStorage(globalUtils.constants.MULTISIG_TRANSACTIONS, res => {
			this._transactions = res || {}
		});
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

	getTokens: function (safe, callback) {
		// 
	},

	getTransactions: function (safe, callback) {
		this._getContract(safe).methods.getTransactionCount(true, true).call(null, (error, result) => {
			if (error) {
				return console.error(error);
			}

			if (callback && result) {
				const howMany = parseInt(result);
				this._transactionCount.set(safe, howMany);
				this._indexOfPaging = 0;
				return callback(howMany);
			}
		});
	},

	getPagingTransactions: async function (safe) {
		const now = (new Date()).getTime();
		const txs = this._transactions[safe];
		const count = this._transactionCount.get(safe);

		this._indexOfPaging = Math.floor(Object.values(txs).length / this._pagingCount);

		const from = count - this._indexOfPaging * this._pagingCount - 1;

		let i = 0;

		do {
			const theIdx = String(from - i);
			i++;

			if (theIdx >= 0 && (!txs[theIdx] || (now - txs[theIdx]?.updateTime) > 300000)) {
				const result = await this.getTransactionById(safe, theIdx);
				if (result) {
					txs[theIdx] = result;
				}
			}
		} while (i < this._pagingCount && i >= 0);

		this._indexOfPaging++;

		god.setItemInLocalStorage(globalUtils.constants.MULTISIG_TRANSACTIONS, this._transactions);
	},

	fetchTxs: function (safe) {
		return Object.values(this._transactions[safe]).reverse();
	},

	getTransactionById: async function (safe, id) {
		const transactionId = parseInt(id);

		try {
			const res = await this._getContract(safe).methods.transactions(transactionId).call();
			res.id = transactionId;
			res.updateTime = (new Date()).getTime();
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