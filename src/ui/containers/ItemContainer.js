import {connect} from 'react-redux';

import {
	autofillItem,
	createItem,
	updateItem,
	deleteItem
} from '../actions/items';

import {
	getSocketStatus,
	getUser,

	getInstances,
	getButtons,
	getItem
} from '../helpers/selectors';

import ItemDetails from '../components/Items/ItemDetails';

function getSouceOptions(instances) {
	const options = [];

	instances.forEach((instance) => {
		options.push({
			name: instance.name,
			id: instance.wowId,
			heading: true
		});

		instance.bosses.forEach((boss) => {
			options.push({
				name: boss.name,
				id: boss.wowId,
				child: true
			});
		});
	});

	return options;
}

function getButtonsInGroups(buttons) {
	return buttons.sort((a, b) => {
		if (a.order !== b.order) return a.order - b.order;

		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();

		if (nameA < nameB) return -1;
		if (nameA > nameB) return 1;
		return 0;
	}).groupBy((b) => b.order).toList();
}

function mapStateToProps(state, {params}) {
	const itemId = parseInt(params.itemId, 10);
	const item = getItem(state, itemId, true);

	const buttons = getButtons(state);
	const buttonGroups = getButtonsInGroups(buttons);

	const instances = getInstances(state);
	const sourceOptions = getSouceOptions(instances);

	const user = getUser(state);

	return {
		canManageItems: user.canManageItems(),
		isConnected: getSocketStatus(state),

		buttons: buttonGroups,
		sourceOptions,
		item
	};
}

export default connect(mapStateToProps, {
	onAutofill: autofillItem,
	onCreate: createItem,
	onUpdate: updateItem,
	onDelete: deleteItem
})(ItemDetails);
