import {connect} from 'react-redux';

import {getButtons, getUser} from '../helpers/selectors';

import ButtonsList from '../components/Buttons/ButtonsList';

function mapStateToProps(state) {
	const user = getUser(state);

	return {
		canManageButtons: user.canManageButtons(),
		buttons: getButtons(state)
	};
}

export default connect(mapStateToProps)(ButtonsList);
