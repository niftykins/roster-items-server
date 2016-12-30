import {merge} from 'lodash';
import {makeExecutableSchema} from 'graphql-tools';

const rootSchema = `
	type User {
		id: String!
		battletag: String!
	}

	type Query {
		currentUser: User
	}

	schema {
		query: Query
	}
`;

const rootResolvers = {
	Query: {
		currentUser(root, args, context) {
			return context.user || null;
		}
	}
};

const schema = [rootSchema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
});

export default executableSchema;
