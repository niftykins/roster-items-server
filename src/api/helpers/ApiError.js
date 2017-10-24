export default class ApiError extends Error {
	constructor(...args) {
		super(...args);

		Object.defineProperty(this, 'name', {
			value: 'ApiError'
		});

		Object.defineProperty(this, 'isApiError', {
			value: true
		});

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}
}

// const r = new ApiError('err');
// console.log(r, r.isApiError);
