// sets the component's state to disabled if any of the
// refs have an empty result for their getValue call
export default function checkForDisabled() {
	let disabled = false;

	if (this.checkForDisabled && this.checkForDisabled()) {
		disabled = true;
	}

	if (!disabled) {
		disabled = Object.keys(this.fields).some((key) => {
			const field = this.fields[key];

			// not an input component so abort
			if (!field || !field.getValue) return false;

			// if it's optional we don't care if it has a value
			if (field.isOptional && field.isOptional()) return false;

			// if there's no value then we need to trigger a disable
			if (!field.getValue()) return true;

			return false;
		});
	}

	if (disabled !== this.state.disabled) {
		this.setState({disabled});
	}
}
