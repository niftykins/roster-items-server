import joi from 'joi';

export const rules = {
	numberString: joi.string()
		.max(15)
		.trim()
		.regex(/^[0-9]+$/, {name: 'numbers'}),

	string: joi.string()
		.max(50)
		.trim()
};

export function validate(schema, data, opts = {}) {
	const r = schema.validate(data, {
		presence: 'required',
		abortEarly: false,

		...opts
	});

	if (r.error) console.log(r.error);

	return r;
}
