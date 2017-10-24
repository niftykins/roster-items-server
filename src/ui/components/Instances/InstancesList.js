import {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Link} from 'react-router';

import Instance from '../../models/instance';

export default function InstancesList({canManageInstances, instances}) {
	const instanceItems = instances.map((instance) => (
		<InstanceItem key={instance.id} instance={instance} />
	));

	return (
		<div className="view-list-container">
			<div className="view-list">
				{canManageInstances &&
					<Link
						className="view-list-item add-new"
						activeClassName="active"
						to="/instances/new"
					>
						Add new instance
					</Link>
				}

				{instanceItems}
			</div>
		</div>
	);
}

InstancesList.propTypes = {
	canManageInstances: PropTypes.bool.isRequired,
	instances: ImmutablePropTypes.listOf(PropTypes.instanceOf(Instance))
};


function InstanceItem({instance}) {
	return (
		<Link
			className="view-list-item"
			activeClassName="active"
			to={`/instances/${instance.id}`}
		>
			<div className="name">
				{instance.name}
			</div>
		</Link>
	);
}
