import {cloneElement} from 'react';

import ButtonsListContainer from '../../containers/ButtonsListContainer';

export default function ButtonsView({children, params}) {
	return (
		<div className="standard-view button-view">
			<ButtonsListContainer />

			{cloneElement(children, {key: params.buttonId})}
		</div>
	);
}
