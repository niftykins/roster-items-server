import {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import Ladda, {EXPAND_RIGHT} from 'react-ladda';

import checkForDisabled from '../../helpers/checkForDisabled';

import {ROLES, SLOTS} from '../../constants/wow';

import Button from '../../models/button';
import Item from '../../models/item';

import RoleGroups from '../Utils/RoleGroups';
import Picker from '../Utils/Picker';
import Input from '../Utils/Input';

const SLOT_ITEMS = Object.values(SLOTS).map((s) => ({id: s, name: s}));

export default class ItemDetails extends Component {
	static propTypes = {
		onAutofill: PropTypes.func.isRequired,
		onCreate: PropTypes.func.isRequired,
		onUpdate: PropTypes.func.isRequired,
		onDelete: PropTypes.func.isRequired,

		canManageItems: PropTypes.bool.isRequired,
		isConnected: PropTypes.bool.isRequired,

		item: PropTypes.instanceOf(Item).isRequired,

		sourceOptions: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			id: PropTypes.string.isRequired,
			child: PropTypes.bool
		})).isRequired,

		buttons: ImmutablePropTypes.listOf(ImmutablePropTypes.listOf(
			PropTypes.instanceOf(Button)
		)).isRequired,

		params: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props);

		this.handleCheckForDisabled = checkForDisabled.bind(this);

		this.fields = {};

		this.state = {
			// editing if the thing is new and isn't meant to be something
			editing: props.item.isNew() && !props.params.itemId,

			disabled: props.item.isNew(),
			confirming: false,

			...this.getInitialFieldState()
		};
	}

	getInitialFieldState() {
		return {
			sourceId: this.props.item.sourceId,
			slot: this.props.item.slot,

			[ROLES.MELEE]: this.props.item.allowed[ROLES.MELEE],
			[ROLES.RANGED]: this.props.item.allowed[ROLES.RANGED],
			[ROLES.TANKS]: this.props.item.allowed[ROLES.TANKS],
			[ROLES.HEALERS]: this.props.item.allowed[ROLES.HEALERS]
		};
	}

	checkForDisabled() {
		if (!this.state.sourceId) return true;
		if (!this.state.slot) return true;

		const totalSize = this.state[ROLES.MELEE].size +
			this.state[ROLES.RANGED].size +
			this.state[ROLES.TANKS].size +
			this.state[ROLES.HEALERS].size;

		if (!totalSize) return true;

		return false;
	}

	handleAutofill = () => {
		const url = this.autofill.getValue();
		if (!url) return;

		this.props.onAutofill(url, (item) => {
			if (!this.state.editing) return;

			const update = {
				sourceId: '',
				slot: ''
			};

			this.fields.name.setValue(item.name);
			this.fields.wowId.setValue(item.id);

			SLOT_ITEMS.some((option) => {
				const slot = item.slot.name || 'misc';

				if (option.name.toLowerCase() === slot.toLowerCase()) {
					update.slot = option.id;
					return true;
				}

				return false;
			});

			this.props.sourceOptions.some((option) => {
				if (option.name === item.sourceName) {
					update.sourceId = option.id;
					return true;
				}

				return false;
			});


			// try to auto apply some buttons
			// subclass covers armour types and relics
			const subclass = (item.subclass.name || '').toLowerCase();

			this.props.buttons.flatten(1).forEach((button) => {
				const name = button.name.toLowerCase();
				let apply = false;

				if (subclass.indexOf(name) === 0) apply = true;

				if (apply) this.handleButton(button.select);
			});


			this.setState(update);
		});
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

	handleButton = (select, isReset) => {
		const update = {};

		if (isReset) {
			Object.values(ROLES).forEach((role) => {
				update[role] = this.state[role].clear();
			});
		} else {
			Object.values(ROLES).forEach((role) => {
				const selectRole = select[role];
				const stateRole = this.state[role];

				if (!stateRole || !selectRole) return;

				update[role] = stateRole.push(...selectRole).toSet().toList();
			});
		}

		this.setState(update, this.handleCheckForDisabled);
	}

	handleSourceChange = (sourceId) => {
		this.setState({sourceId}, this.handleCheckForDisabled);
	}

	handleSlotChange = (slot) => {
		this.setState({slot}, this.handleCheckForDisabled);
	}

	handleSave = () => {
		const name = this.fields.name.getValue();
		const wowId = this.fields.wowId.getValue();

		const sourceId = this.state.sourceId;
		const slot = this.state.slot;

		const allowed = {
			[ROLES.MELEE]: this.state[ROLES.MELEE].toJS(),
			[ROLES.RANGED]: this.state[ROLES.RANGED].toJS(),
			[ROLES.TANKS]: this.state[ROLES.TANKS].toJS(),
			[ROLES.HEALERS]: this.state[ROLES.HEALERS].toJS()
		};

		if (!name || !wowId || !sourceId || !slot) return;

		const data = {
			sourceId,
			allowed,
			wowId,
			name,
			slot
		};

		// create or update
		if (this.props.item.isNew()) {
			this.props.onCreate(data);
		} else {
			this.props.onUpdate(this.props.item.id, data, () => {
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
		const {item} = this.props;

		if (!this.props.canManageItems && item.isNew()) {
			return null;
		}


		const isDisabled = !this.props.canManageItems ||
			!this.props.isConnected ||
			this.state.disabled ||
			item.isSaving() ||
			item.isDeleting();

		const deleteButtonClassName = classnames({
			disabled: isDisabled
		}, 'left red outline button');

		const saveButtonClassName = classnames({
			disabled: isDisabled
		}, 'green button');


		let allowed = {
			[ROLES.MELEE]: this.props.item.allowed[ROLES.MELEE],
			[ROLES.RANGED]: this.props.item.allowed[ROLES.RANGED],
			[ROLES.TANKS]: this.props.item.allowed[ROLES.TANKS],
			[ROLES.HEALERS]: this.props.item.allowed[ROLES.HEALERS]
		};
		if (this.state.editing) {
			allowed = {
				[ROLES.MELEE]: this.state[ROLES.MELEE],
				[ROLES.RANGED]: this.state[ROLES.RANGED],
				[ROLES.TANKS]: this.state[ROLES.TANKS],
				[ROLES.HEALERS]: this.state[ROLES.HEALERS]
			};
		}

		return (
			<div className="view-details-container">
				<div className="view-details-inner">
					<div className="view-details items-details">
						<h1>{item.isNew() ? 'Add new item' : 'Update item'}</h1>

						{this.state.editing &&
							<div className="card">
								<Input
									onSubmit={this.handleAutofill}
									ref={(r) => (this.autofill = r)}
									label="Autofill from Wowhead"
									note="Paste a link to the item on Wowhead and we'll attempt to automatically fill in some values based on the information we get back from Wowhead."
									placeholder="http://www.wowhead.com/item=140793/perfectly-preserved-cake"
									withActionButton={true}
									autoFocus={true}
								>
									<div
										className="green button"
										onClick={this.handleAutofill}
									>
										Go
									</div>
								</Input>
							</div>
						}

						<div className="card">
							<Input
								onChange={this.handleCheckForDisabled}
								ref={(r) => (this.fields.name = r)}
								disabled={!this.state.editing}
								defaultValue={item.name}
								placeholder="Perfectly Preserved Cake"
								label="Name"
							/>

							<Input
								onChange={this.handleCheckForDisabled}
								ref={(r) => (this.fields.wowId = r)}
								disabled={!this.state.editing}
								defaultValue={item.wowId}
								placeholder="140793"
								label="ID"
							/>

							<Picker
								onChange={this.handleSourceChange}
								disabled={!this.state.editing}
								placeholder="Select a source"
								value={this.state.editing ? this.state.sourceId : this.props.item.sourceId}
								items={this.props.sourceOptions}
								label="Drops from"
								labelHint="(selecting an instance implies a trash drop)"
							/>

							<Picker
								onChange={this.handleSlotChange}
								disabled={!this.state.editing}
								placeholder="Select a slot"
								value={this.state.editing ? this.state.slot : this.props.item.slot}
								items={SLOT_ITEMS}
								label="Slot"
							/>
						</div>

						<div className="card">
							<RoleGroups
								onToggle={this.handleClassToggle}
								isDisabled={!this.state.editing}
								{...allowed}
							/>
						</div>
					</div>

					{this.props.canManageItems &&
						<div className="view-actions-bar">
							{this.state.confirming &&
								<div className="button-group">
									<Ladda
										onClick={() => this.props.onDelete(item.id)}
										className={deleteButtonClassName}
										loading={item.isDeleting()}
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
									{!item.isNew() &&
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
										loading={item.isSaving()}
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

				{this.props.canManageItems && this.state.editing &&
					<ButtonPanel
						onClick={this.handleButton}
						buttons={this.props.buttons}
					/>
				}
			</div>
		);
	}
}

function ButtonPanel({onClick, buttons}) {
	const groups = buttons.map((group, i) => {
		const buttonItems = group.map((button) => (
			<div
				key={button.id}
				onClick={() => onClick(button.select)}
				className="small outline button"
			>
				{button.name}
			</div>
		));

		return (
			<div
				key={i}
				className="button-group"
			>
				{buttonItems}
			</div>
		);
	});

	return (
		<div className="view-right-panel">
			{groups}

			<div className="button-group">
				<div
					onClick={() => onClick(null, true)}
					className="small red outline button"
				>
					Clear selections
				</div>
			</div>
		</div>
	);
}
