import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import api from '../helpers/api';

import {fetchInstances} from '../actions/instances';
import {fetchButtons} from '../actions/buttons';
import {fetchItems} from '../actions/items';
import {fetchUser} from '../actions/auth';

import {
	getInstancesLoading,
	getInstancesError,

	getButtonsLoading,
	getButtonsError,

	getItemsLoading,
	getItemsError
} from '../helpers/selectors';

import HeaderContainer from './HeaderContainer';

import Loading from '../components/Utils/Loading';


function Broken() {
	return (
		<div className="">
			Something super duper broke :/
		</div>
	);
}

class GlobalContainer extends Component {
	static propTypes = {
		fetchInstances: PropTypes.func.isRequired,
		fetchButtons: PropTypes.func.isRequired,
		fetchItems: PropTypes.func.isRequired,
		fetchUser: PropTypes.func.isRequired,

		isLoading: PropTypes.bool.isRequired,
		isBroken: PropTypes.bool.isRequired,

		children: PropTypes.node
	}

	constructor(props) {
		super(props);

		this.handleFetchData(false);

		api.registerReconnectionHandler(this.handleFetchData);
	}

	handleFetchData = (isReconnect) => {
		this.props.fetchUser(isReconnect);
		this.props.fetchButtons(isReconnect);
		this.props.fetchInstances(isReconnect);
		this.props.fetchItems(isReconnect);
	}

	render() {
		let content = this.props.children;

		if (this.props.isLoading) content = <Loading isCentered={true} />;
		else if (this.props.isBroken) content = <Broken />;

		return (
			<div className="page-container">
				<HeaderContainer />

				{content}
			</div>
		);
	}
}

function getLoading(state) {
	return getButtonsLoading(state) ||
		getInstancesLoading(state) ||
		getItemsLoading(state);
}

function getError(state) {
	return !!getButtonsError(state) ||
		!!getInstancesError(state) ||
		!!getItemsError(state);
}

function mapStateToProps(state) {
	return {
		isLoading: getLoading(state),
		isBroken: getError(state)
	};
}

export default connect(mapStateToProps, {
	fetchInstances,
	fetchButtons,
	fetchItems,
	fetchUser
})(GlobalContainer);
