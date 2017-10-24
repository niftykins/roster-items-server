import {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';

export default class Input extends Component {
	static propTypes = {
		size: PropTypes.string,
		type: PropTypes.string,

		textarea: PropTypes.bool,
		textareaProps: PropTypes.object,

		defaultValue: PropTypes.string,

		className: PropTypes.string,
		disabled: PropTypes.bool,

		label: PropTypes.string,
		labelHint: PropTypes.string,

		note: PropTypes.string,

		onSubmit: PropTypes.func,
		onChange: PropTypes.func,
		optional: PropTypes.bool,

		withActionButton: PropTypes.bool,
		children: PropTypes.node
	}

	static defaultProps = {
		textareaProps: {},
		type: 'text',
		size: ''
	}

	componentDidMount() {
		this.id = `input-${Date.now()}-${Math.random().toFixed(5)}`;
	}

	getValue() {
		if (this.props.disabled) return this.props.defaultValue;
		return this.input.value.trim();
	}

	setValue(value = '') {
		this.input.value = value;
	}

	isOptional() {
		return this.props.optional;
	}

	handleSubmit = (e) => {
		if (e.which === 13 && this.props.onSubmit) {
			this.props.onSubmit();
		}
	}

	renderInput() {
		const {
			type,
			size,

			textareaProps,
			textarea,

			onChange,
			onSubmit,

			disabled,

			withActionButton,
			children,

			...props
		} = this.props;

		// exclude these from getting into props
		delete props.labelHint;
		delete props.className;
		delete props.note;

		const p = {
			className: `${size} input`,
			ref: (r) => (this.input = r),
			id: this.id,

			onKeyPress: onSubmit && this.handleSubmit,
			onChange,
			type,

			...props
		};

		let input = <input {...p} />;
		if (disabled) input = <div {...p}>{this.props.defaultValue}</div>;
		else if (textarea) input = <Textarea {...p} {...textareaProps} />;

		const wrapperClassName = classnames({
			'with-action-button': withActionButton
		}, 'input-child-wrapper');

		return (
			<div className={wrapperClassName}>
				{input}
				{children}
			</div>
		);
	}

	render() {
		const {label, labelHint, note, className} = this.props;

		const hint = labelHint && (
			<span className="hint">
				{labelHint}
			</span>
		);

		const groupClassName = classnames({
			disabled: this.props.disabled,
			className
		}, 'input-group');

		return (
			<div className={groupClassName}>
				{label &&
					<label htmlFor={this.id}>
						{label} {hint}
					</label>
				}

				{this.renderInput()}

				{note &&
					<div className="note">
						{note}
					</div>
				}
			</div>
		);
	}
}
