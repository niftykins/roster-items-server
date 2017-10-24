import {connect} from 'react-redux';

import {
	createInstance,
	updateInstance,
	deleteInstance
} from '../actions/instances';

import {
	getSocketStatus,
	getInstance,
	getUser
} from '../helpers/selectors';

import InstanceDetails from '../components/Instances/InstanceDetails';

function mapStateToProps(state, {params}) {
	const instanceId = parseInt(params.instanceId, 10);
	const instance = getInstance(state, instanceId, true);

	const user = getUser(state);

	return {
		canManageInstances: user.canManageInstances(),
		isConnected: getSocketStatus(state),

		instance
	};
}

export default connect(mapStateToProps, {
	onCreate: createInstance,
	onUpdate: updateInstance,
	onDelete: deleteInstance
})(InstanceDetails);
