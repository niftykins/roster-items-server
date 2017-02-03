import ApiError from '../helpers/ApiError';

export function requireAuth(context) {
	if (!context.user) {
		throw new ApiError('Must be logged in to do that');
	}
}

export function requireValidation(validator, data) {
	const valid = validator(data);
	if (valid.error) {
		throw new ApiError('Data did not pass validation');
	}

	return valid.value;
}

export function requireResult(result) {
	if (!result) {
		throw new ApiError('Nothing matches the passed ID');
	}
}
