import {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Ladda, {EXPAND_RIGHT} from 'react-ladda';

import checkForDisabled from '../../helpers/checkForDisabled';

import {ROLES} from '../../constants/wow';

import Button from '../../models/button';

import Input from '../Utils/Input';
import RoleGroups from '../Utils/RoleGroups';

export default class ButtonDetails extends Component {
	static propTypes = {
		onCreate: PropTypes.func.isRequired,
		onUpdate: PropTypes.func.isRequired,
		onDelete: PropTypes.func.isRequired,

		canManageButtons: PropTypes.bool.isRequired,
		isConnected: PropTypes.bool.isRequired,

		button: PropTypes.instanceOf(Button).isRequired,

		params: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props);

		this.handleCheckForDisabled = checkForDisabled.bind(this);

		this.fields = {};

		this.state = {
			// editing if the thing is new and isn't meant to be something
			editing: props.button.isNew() && !props.params.buttonId,

			disabled: props.button.isNew(),
			confirming: false,

			...this.getInitialFieldState()
		};
	}

	getInitialFieldState() {
		return {
			[ROLES.MELEE]: this.props.button.select[ROLES.MELEE],
			[ROLES.RANGED]: this.props.button.select[ROLES.RANGED],
			[ROLES.TANKS]: this.props.button.select[ROLES.TANKS],
			[ROLES.HEALERS]: this.props.button.select[ROLES.HEALERS]
		};
	}

	checkForDisabled() {
		const totalSize = this.state[ROLES.MELEE].size +
			this.state[ROLES.RANGED].size +
			this.state[ROLES.TANKS].size +
			this.state[ROLES.HEALERS].size;

		if (!totalSize) return true;

		return false;
	}

	handleClassToggle = (role, cls) => {
		const list = this.state[role];
		const index = list.indexOf(cls);

		let newList;
		if (index === -1) {
			newList = list.push(cls);
		} else {
			newList = list.delete(index);
		}

		this.setState({[role]: newList}, this.handleCheckForDisabled);
	}

	handleSave = () => {
		const name = this.fields.name.getValue();
		const order = this.fields.order.getValue();

		const select = {
			[ROLES.MELEE]: this.state[ROLES.MELEE].toJS(),
			[ROLES.RANGED]: this.state[ROLES.RANGED].toJS(),
			[ROLES.TANKS]: this.state[ROLES.TANKS].toJS(),
			[ROLES.HEALERS]: this.state[ROLES.HEALERS].toJS()
		};

		if (!name || !order) return;

		const data = {
			order: parseInt(order, 10) || 0,
			select,
			name
		};

		// create or update
		if (this.props.button.isNew()) {
			this.props.onCreate(data);
		} else {
			this.props.onUpdate(this.props.button.id, data, () => {
				this.handleEditing(false);
			});
		}
	}

	handleEditing = (editing) => {
		this.setState({
			editing,

			...this.getInitialFieldState()
		});
	}

	render() {
		const {button} = this.props;

		if (!this.props.canManageButtons && button.isNew()) {
			return null;
		}


		const isDisabled = !this.props.canManageButtons ||
			!this.props.isConnected ||
			this.state.disabled ||
			button.isSaving() ||
			button.isDeleting();

		const deleteButtonClassName = classnames({
			disabled: isDisabled
		}, 'left red outline button');

		const saveButtonClassName = classnames({
			disabled: isDisabled
		}, 'green button');


		let select = {
			[ROLES.MELEE]: this.props.button.select[ROLES.MELEE],
			[ROLES.RANGED]: this.props.button.select[ROLES.RANGED],
			[ROLES.TANKS]: this.props.button.select[ROLES.TANKS],
			[ROLES.HEALERS]: this.props.button.select[ROLES.HEALERS]
		};
		if (this.state.editing) {
			select = {
				[ROLES.MELEE]: this.state[ROLES.MELEE],
				[ROLES.RANGED]: this.state[ROLES.RANGED],
				[ROLES.TANKS]: this.state[ROLES.TANKS],
				[ROLES.HEALERS]: this.state[ROLES.HEALERS]
			};
		}

		return (
			<div className="view-details-container">
				<div className="view-details-inner">
					<div className="view-details button-details">
						<h1>{button.isNew() ? 'Add new button' : 'Update button'}</h1>

						<div className="card">
							<Input
								onChange={this.handleCheckForDisabled}
								ref={(r) => (this.fields.name = r)}
								disabled={!this.state.editing}
								defaultValue={button.name}
								placeholder="Plate"
								label="Name"
								note="Names are important as they're used to auto apply the button during an item autofill"
								autoFocus={true}
							/>

							<Input
								onChange={this.handleCheckForDisabled}
								ref={(r) => (this.fields.order = r)}
								disabled={!this.state.editing}
								defaultValue={String(button.order)}
								placeholder="0"
								label="Order group"
								labelHint="(buttons with the same order will be grouped together)"
							/>
						</div>

						<div className="card">
							<RoleGroups
								onToggle={this.handleClassToggle}
								isDisabled={!this.state.editing}
								{...select}
							/>
						</div>
					</div>

					{this.props.canManageButtons &&
						<div className="view-actions-bar">
							{this.state.confirming &&
								<div className="button-group">
									<Ladda
										onClick={() => this.props.onDelete(button.id)}
										className={deleteButtonClassName}
										loading={button.isDeleting()}
										data-style={EXPAND_RIGHT}
									>
										Confirm
									</Ladda>

									<div
										onClick={() => this.setState({confirming: false})}
										className="outline button"
									>
										Cancel
									</div>
								</div>
							}

							{!this.state.confirming && this.state.editing &&
								<div className="button-group">
									{!button.isNew() &&
										<div
											onClick={() => this.setState({confirming: true})}
											className={deleteButtonClassName}
										>
											Remove
										</div>
									}

									<div
										onClick={() => this.handleEditing(false)}
										className="outline button"
									>
										Cancel
									</div>

									<Ladda
										onClick={this.handleSave}
										className={saveButtonClassName}
										loading={button.isSaving()}
										data-style={EXPAND_RIGHT}
									>
										Save
									</Ladda>
								</div>
							}

							{!this.state.editing &&
								<div className="button-group">
									<div
										onClick={() => this.handleEditing(true)}
										className="blue button"
									>
										Edit
									</div>
								</div>
							}
						</div>
					}
				</div>
			</div>
		);
	}
}
