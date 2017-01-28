import {addHandler} from '../socket';

import * as rpc from '../constants/rpc';

import Users from '../models/users';


async function userFetch(data, context) {
	return Users.transformToSelf(context.user);
}

addHandler(rpc.USER_FETCH, userFetch);
