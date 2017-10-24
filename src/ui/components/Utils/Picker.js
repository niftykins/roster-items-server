import {Component, PropTypes} from 'react';
import classnames from 'classnames';

import Menu from '../Utils/Menu';

export default class Picker extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,

		placeholder: PropTypes.string,
		value: PropTypes.string,
		label: PropTypes.string,
		labelHint: PropTypes.string,
		size: PropTypes.string,

		disabled: PropTypes.bool,

		items: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			id: PropTypes.string.isRequired,
			heading: PropTypes.bool,
			child: PropTypes.bool
		})).isRequired
	}

	state = {
		expanded: false
	}

	handleToggleMenu = () => {
		this.menu.toggleExpanded();
	}

	handleSyncExpanded = (expanded) => {
		this.setState({expanded});
	}

	render() {
		const pickerClassName = classnames({
			expanded: this.state.expanded,
			disabled: this.props.disabled
		}, 'picker input-group');

		const inputClassName = classnames('input', this.props.size);

		let item;
		const opts = this.props.items.map((i) => {
			const optionClass = classnames({
				selected: i.id === this.props.value,
				heading: i.heading,
				child: i.child
			});

			if (i.id === this.props.value) {
				item = i;
			}

			return (
				<div
					key={i.id}
					className={optionClass}
					onClick={() => this.props.onChange(i.id)}
				>
					{i.name}
				</div>
			);
		});

		const hint = this.props.labelHint && (
			<span className="hint">
				{this.props.labelHint}
			</span>
		);

		if (this.props.disabled) {
			return (
				<div
					className={pickerClassName}
					onClick={!this.props.disabled && this.handleToggleMenu}
				>
					{this.props.label &&
						<label>
							{this.props.label} {hint}
						</label>
					}

					<div className={inputClassName}>
						{item ? item.name : this.props.placeholder}
					</div>
				</div>
			);
		}

		return (
			<div
				className={pickerClassName}
				onClick={this.handleToggleMenu}
			>
				{this.props.label &&
					<label>
						{this.props.label} {hint}
					</label>
				}

				<div className={inputClassName}>
					{item ? item.name : this.props.placeholder}

					<i className="material-icons">
						keyboard_arrow_down
					</i>
				</div>

				<Menu
					ref={(r) => (this.menu = r)}
					onSyncExpanded={this.handleSyncExpanded}
				>
					{opts}
				</Menu>
			</div>
		);
	}
}
