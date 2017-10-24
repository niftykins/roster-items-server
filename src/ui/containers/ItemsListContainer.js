import {connect} from 'react-redux';

import {searchItems} from '../actions/items';

import {
	getItemsSearch,
	getItems,
	getUser
} from '../helpers/selectors';

import ItemsList from '../components/Items/ItemsList';

function getFilteredItems(items, search) {
	return items.filter((item) => (
		item.name.toLowerCase().includes(search.toLowerCase())
	));
}

function mapStateToProps(state) {
	const items = getItems(state);
	const search = getItemsSearch(state);

	const user = getUser(state);

	return {
		canManageItems: user.canManageItems(),

		items: getFilteredItems(items, search),
		search
	};
}

export default connect(mapStateToProps, {
	onSearch: searchItems
})(ItemsList);
