export const safeProvider = {
	_originProvider: null,

	init: function (provider) {
		if (provider) {
			this._originProvider = provider;
		}

		return this;
	}
};