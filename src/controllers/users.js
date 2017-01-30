import {addSocketHandlers} from '../socket';

import RPC from '../constants/rpc';

import Users from '../models/users';


async function fetchUser(data, context) {
	return Users.transformToSelf(context.user);
}

addSocketHandlers({
	[RPC.USER_FETCH]: fetchUser
});
