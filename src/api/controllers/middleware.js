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

export function requireItemsAdmin(context) {
	if (!context.user || (!context.user.isItemsAdmin && !context.user.isItemsSuperAdmin)) {
		throw new ApiError('You must be an admin to do that');
	}
}

export function requireItemsSuperAdmin(context) {
	if (!context.user || !context.user.isItemsSuperAdmin) {
		throw new ApiError('You must be a super admin to do that');
	}
}
