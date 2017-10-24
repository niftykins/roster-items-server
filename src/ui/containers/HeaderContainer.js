import {connect} from 'react-redux';

import {login, logout} from '../actions/auth';

import {getUser, getBanner} from '../helpers/selectors';

import Header from '../components/Header/Header';

function mapStateToProps(state) {
	return {
		banner: getBanner(state),
		user: getUser(state)
	};
}

export default connect(mapStateToProps, {
	onLogout: logout,
	onLogin: login
})(Header);
