import {Component, PropTypes} from 'react';
import classnames from 'classnames';

export default class Menu extends Component {
	static propTypes = {
		onSyncExpanded: PropTypes.func,
		className: PropTypes.string,
		children: PropTypes.node
	}

	static defaultProps = {
		onSyncExpanded() {}
	}

	state = {
		expanded: false
	}

	componentWillUnmount() {
		this.removeEvent();
	}

	isOpen() {
		return this.state.expanded;
	}

	toggleExpanded = () => {
		const expanded = !this.state.expanded;

		this.setState({expanded}, () => {
			if (expanded) this.addEvent();
			else this.removeEvent();
		});

		this.props.onSyncExpanded(expanded);
	}

	addEvent() {
		document.addEventListener('click', this.handleDocumentClick);
	}

	removeEvent() {
		document.removeEventListener('click', this.handleDocumentClick);
	}

	handleDocumentClick = (e) => {
		if (this.menu && !this.menu.contains(e.target)) {
			const expanded = false;

			this.setState({expanded});
			this.props.onSyncExpanded(expanded);

			this.removeEvent();
		}
	}

	render() {
		if (!this.state.expanded) return null;

		const menuClassName = classnames('menu', this.props.className);

		return (
			<div
				ref={(r) => (this.menu = r)}
				className={menuClassName}
			>
				<div className="menu-content">
					{this.props.children}
				</div>
			</div>
		);
	}
}
