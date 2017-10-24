import {Record, List} from 'immutable';

import {ROLES} from '../constants/wow';

const RoleArrays = Record({
	[ROLES.MELEE]: List(),
	[ROLES.RANGED]: List(),
	[ROLES.TANKS]: List(),
	[ROLES.HEALERS]: List()
});

export default RoleArrays;

export function fixRoleArrays(data = {}) {
	const fixed = {};

	Object.keys(data).forEach((key) => {
		fixed[key] = List(data[key]);
	});

	return new RoleArrays(fixed);
}
