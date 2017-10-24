import {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Link} from 'react-router';

import Button from '../../models/button';

export default function ButtonsList({canManageButtons, buttons}) {
	const buttonItems = buttons.map((button) => (
		<ButtonItem key={button.id} button={button} />
	));

	return (
		<div className="view-list-container">
			<div className="view-list">
				{canManageButtons &&
					<Link
						className="view-list-item add-new"
						activeClassName="active"
						to="/buttons/new"
					>
						Add new button
					</Link>
				}

				{buttonItems}
			</div>
		</div>
	);
}

ButtonsList.propTypes = {
	canManageButtons: PropTypes.bool.isRequired,
	buttons: ImmutablePropTypes.listOf(PropTypes.instanceOf(Button))
};


function ButtonItem({button}) {
	return (
		<Link
			className="view-list-item"
			activeClassName="active"
			to={`/buttons/${button.id}`}
		>
			<div className="name">
				{button.name}
			</div>
		</Link>
	);
}
