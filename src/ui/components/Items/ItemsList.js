import {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Link} from 'react-router';

import Item from '../../models/item';

import Input from '../Utils/Input';

export default function ItemsList({onSearch, canManageItems, search, items}) {
	const itemItems = items.map((item) => (
		<ItemItem key={item.id} item={item} />
	));

	return (
		<div className="view-list-container">
			<div className="search">
				<Input
					onChange={(e) => onSearch(e.target.value)}
					value={search}
					placeholder="Search items"
				/>
			</div>

			<div className="view-list">
				{canManageItems &&
					<Link
						className="view-list-item add-new"
						activeClassName="active"
						to="/items/new"
					>
						Add new item
					</Link>
				}

				{itemItems}
			</div>
		</div>
	);
}

ItemsList.propTypes = {
	onSearch: PropTypes.func.isRequired,

	canManageItems: PropTypes.bool.isRequired,
	search: PropTypes.string,

	items: ImmutablePropTypes.listOf(PropTypes.instanceOf(Item))
};


function ItemItem({item}) {
	return (
		<Link
			className="view-list-item"
			activeClassName="active"
			to={`/items/${item.id}`}
		>
			<div className="name">
				{item.name}
			</div>
		</Link>
	);
}
