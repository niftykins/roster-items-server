import {connect} from 'react-redux';

import {getInstances, getUser} from '../helpers/selectors';

import InstancesList from '../components/Instances/InstancesList';

function mapStateToProps(state) {
	const user = getUser(state);

	return {
		canManageInstances: user.canManageInstances(),
		instances: getInstances(state)
	};
}

export default connect(mapStateToProps)(InstancesList);
