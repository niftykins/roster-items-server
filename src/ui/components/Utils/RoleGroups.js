import {PropTypes} from 'react';
import classnames from 'classnames';

import {ROLE_GROUPS, CLASSES_DISPLAY} from '../../constants/wow';

export default function RoleGroups({onToggle, isDisabled, ...rest}) {
	const roleGroups = ROLE_GROUPS.map((group) => (
		<RoleGroup
			key={group.role}
			onToggle={!isDisabled && onToggle}
			selected={rest[group.role]}
			{...group}
		/>
	));

	const groupsClassName = classnames({
		disabled: isDisabled
	}, 'role-groups');

	return (
		<div className={groupsClassName}>
			{roleGroups}
		</div>
	);
}

RoleGroups.propTypes = {
	onToggle: PropTypes.func.isRequired,
	isDisabled: PropTypes.bool.isRequired
};


function RoleGroup({onToggle, selected, role, classes}) {
	const classItems = classes.map((cls) => (
		<Class
			key={cls}
			onToggle={() => onToggle && onToggle(role, cls)}
			isToggled={selected.includes(cls)}
			cls={cls}
		/>
	));

	return (
		<div className="role-group">
			<div className="role-label">
				{role}
			</div>

			{classItems}
		</div>
	);
}

function Class({onToggle, isToggled, cls}) {
	const toggleClassName = classnames({toggled: isToggled}, 'material-icons');

	return (
		<div
			className="class"
			onClick={onToggle}
		>
			<i className={toggleClassName}>
				{isToggled ? 'check_box' : 'check_box_outline_blank'}
			</i>

			<span className={`wow-style class-font ${cls}`}>
				{CLASSES_DISPLAY[cls]}
			</span>
		</div>
	);
}
