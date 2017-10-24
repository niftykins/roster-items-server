import {PropTypes} from 'react';
import {Link} from 'react-router';
import logo from '../../images/logo.png';

import Banner from '../Utils/Banner';

import User from '../../models/user';

export default function Header({onLogin, onLogout, user, banner}) {
	return (
		<div className="header-nav">
			<div className="brand">
				<img src={logo} />

				<span className="name">
					Item Management
				</span>
			</div>

			<div className="links">
				<Link
					to="/buttons"
					activeClassName="active"
				>
					Buttons
				</Link>

				<Link
					to="/instances"
					activeClassName="active"
				>
					Instances
				</Link>

				<Link
					to="/items"
					activeClassName="active"
				>
					Items
				</Link>

				<UserButton
					onLogin={onLogin}
					onLogout={onLogout}
					user={user}
				/>
			</div>

			<Banner banner={banner} />
		</div>
	);
}

Header.propTypes = {
	onLogin: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,

	user: PropTypes.instanceOf(User).isRequired,

	banner: PropTypes.shape({
		type: PropTypes.string,
		message: PropTypes.string,
		show: PropTypes.bool
	})
};


function UserButton({onLogin, onLogout, user}) {
	if (!user.isNew()) {
		return (
			<div onClick={onLogout}>
				{user.battletag || 'Log out'}
			</div>
		);
	}

	return (
		<div onClick={onLogin}>
			Log in
		</div>
	);
}
