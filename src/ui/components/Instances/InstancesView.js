import {cloneElement} from 'react';

import InstancesListContainer from '../../containers/InstancesListContainer';

export default function InstancesView({children, params}) {
	return (
		<div className="standard-view instances-view">
			<InstancesListContainer />

			{cloneElement(children, {key: params.instanceId})}
		</div>
	);
}
