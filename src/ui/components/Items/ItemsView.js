import {cloneElement} from 'react';

import ItemsListContainer from '../../containers/ItemsListContainer';

export default function ItemsView({children, params}) {
	return (
		<div className="standard-view items-view">
			<ItemsListContainer />

			{cloneElement(children, {key: params.itemId})}
		</div>
	);
}
