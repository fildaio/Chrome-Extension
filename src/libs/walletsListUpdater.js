export const walletsListUpdater = {
	clientCall: () => { },

	update: function (newValue) {
		return this.clientCall([...newValue]);
	}
};