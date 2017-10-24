let enabled = true;

const prefix = 'guildsy.items.';

// need to check if we can even us LS, safari
// private browsing disables it completely
try {
	localStorage.setItem('test', 'test');
	localStorage.removeItem('test');
} catch (e) {
	enabled = false;
}

export function setItem(key, value) {
	if (!enabled) return;

	localStorage.setItem(`${prefix}${key}`, value);
}

export function getItem(key) {
	if (!enabled) return null;

	return localStorage.getItem(`${prefix}${key}`);
}

export function removeItem(key) {
	if (!enabled) return;

	localStorage.removeItem(`${prefix}${key}`);
}

export function getKeys() {
	if (!enabled) return [];

	return Object.keys(localStorage).filter((key) => {
		return key.indexOf(prefix) === 0;
	});
}
