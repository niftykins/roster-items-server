import {Record} from 'immutable';

const User = Record({
	id: null,
	accountId: null,
	battletag: '',

	_isItemsAdmin: false,
	_isItemsSuperAdmin: false
});

class UserWrapper extends User {
	constructor(data = {}) {
		// we want to make the admin fields private because all
		// permissions should pass through the functions to make
		// it as easy as possible to maintain

		const {isItemsAdmin, isItemsSuperAdmin, ...fixed} = data;

		fixed._isItemsAdmin = isItemsAdmin;
		fixed._isItemsSuperAdmin = isItemsSuperAdmin;

		super(fixed);
	}

	isNew() {
		return this.id === null;
	}

	isItemsAdmin() {
		return !!this._isItemsAdmin;
	}

	isItemsSuperAdmin() {
		return !!this._isItemsSuperAdmin;
	}

	canManageInstances() {
		return this.isItemsSuperAdmin();
	}

	canManageButtons() {
		return this.isItemsSuperAdmin();
	}

	canManageItems() {
		return this.isItemsAdmin();
	}
}

export default UserWrapper;
