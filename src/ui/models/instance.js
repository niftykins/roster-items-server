import {Record, List} from 'immutable';

import {DIFFICULTIES} from '../constants/wow';

const Boss = Record({
	wowId: '',
	name: ''
});

const WowheadBonuses = Record({
	[DIFFICULTIES.NORMAL]: '0',
	[DIFFICULTIES.HEROIC]: '0',
	[DIFFICULTIES.MYTHIC]: '0'
});

const Instance = Record({
	id: null,

	wowId: '',
	name: '',

	released: '0',

	wowheadBonuses: new WowheadBonuses(),
	bosses: List(),

	__isSaving: false,
	__isDeleting: false
});


function fixData(data = {}) {
	const fixed = {...data};

	if (data.wowheadBonuses) {
		fixed.wowheadBonuses = new WowheadBonuses(data.wowheadBonuses);
	}

	if (data.bosses) {
		fixed.bosses = List(data.bosses.map((b) => new Boss(b)));
	}

	return fixed;
}

class InstanceWrapper extends Instance {
	static savingKey = '__isSaving'
	static deletingKey = '__isDeleting'

	constructor(data = {}) {
		const instance = {...data};
		if (!data.released) {
			instance.released = Math.floor(Date.now() / 1000).toString();
		}

		super(fixData(instance));
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

export default InstanceWrapper;
