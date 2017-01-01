const schema = `
	type User {
		id: ID!
		battletag: String!
	}
`;

const resolvers = {
	Query: {
		currentUser(root, args, context) {
			return context.user || null;
		}
	}
};

export default {
	resolvers,
	schema
};
