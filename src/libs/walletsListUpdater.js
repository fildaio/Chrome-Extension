export const walletsListUpdater = {
	clientCall: () => { },
	update: function (newValue) {
		console.debug("代理更新", this.clientCall, newValue);
		return this.clientCall([...newValue]);
	}
};