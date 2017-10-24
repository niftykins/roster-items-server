import {Record} from 'immutable';

import RoleArrays, {fixRoleArrays} from './RoleArrays';

const Item = Record({
	id: null,

	wowId: '',
	name: '',
	sourceId: '',
	slot: '',

	allowed: new RoleArrays(),

	__isSaving: false,
	__isDeleting: false
});


function fixData(data = {}) {
	const fixed = {...data};

	if (data.allowed) {
		fixed.allowed = fixRoleArrays(data.allowed);
	}

	return fixed;
}

class ItemWrapper extends Item {
	static savingKey = '__isSaving'
	static deletingKey = '__isDeleting'

	constructor(data) {
		super(fixData(data));
	}

	merge(...args) {
		return super.merge(...args.map((data) => fixData(data)));
	}

	isNew() {
		return this.id === null;
	}

	isSaving() {
		return this[this.constructor.savingKey];
	}

	isDeleting() {
		return this[this.constructor.deletingKey];
	}
}

export default ItemWrapper;
