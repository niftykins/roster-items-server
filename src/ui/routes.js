import {Router, Route, IndexRedirect, IndexRoute} from 'react-router';

import GlobalContainer from './containers/GlobalContainer';

import ItemsView from './components/Items/ItemsView';
import ItemContainer from './containers/ItemContainer';

import InstancesView from './components/Instances/InstancesView';
import InstanceContainer from './containers/InstanceContainer';

import ButtonsView from './components/Buttons/ButtonsView';
import ButtonContainer from './containers/ButtonContainer';


import {getInstances} from './helpers/selectors';

function redirectIndex(store) {
	return (nextState, replace) => {
		let path = 'new';

		const instances = getInstances(store.getState());

		const item = instances && instances.first();
		if (item) path = item.id;

		replace(`${location.pathname}/${path}`);
	};
}

export default function makeRouter(history, store) {
	return (
		<Router history={history}>
			<Route path="/" component={GlobalContainer}>
				<IndexRedirect to="items" />

				<Route path="/items" component={ItemsView}>
					<IndexRedirect to="new" />

					<Route path="new" component={ItemContainer} />
					<Route path=":itemId" component={ItemContainer} />
				</Route>

				<Route path="/instances" component={InstancesView}>
					<IndexRoute onEnter={redirectIndex(store)} />

					<Route path="new" component={InstanceContainer} />
					<Route path=":instanceId" component={InstanceContainer} />
				</Route>

				<Route path="/buttons" component={ButtonsView}>
					<IndexRedirect to="new" />

					<Route path="new" component={ButtonContainer} />
					<Route path=":buttonId" component={ButtonContainer} />
				</Route>
			</Route>
		</Router>
	);
}
