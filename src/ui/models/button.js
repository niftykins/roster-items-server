import {Record} from 'immutable';

import RoleArrays, {fixRoleArrays} from './RoleArrays';

const Button = Record({
	id: null,

	name: '',
	order: 20,

	select: new RoleArrays(),

	__isSaving: false,
	__isDeleting: false
});


function fixData(data = {}) {
	const fixed = {...data};

	if (data.select) {
		fixed.select = fixRoleArrays(data.select);
	}

	return fixed;
}

class ButtonWrapper extends Button {
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

export default ButtonWrapper;
