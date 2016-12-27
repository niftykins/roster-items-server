import {merge} from 'lodash';
import {makeExecutableSchema} from 'graphql-tools';

const rootSchema = `
	type Query {
		stuff: Int
	}

	schema {
		query: Query
	}
`;

const rootResolvers = {
	Query: {

	}
};

const schema = [rootSchema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
});

export default executableSchema;
