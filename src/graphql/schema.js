import {makeExecutableSchema} from 'graphql-tools';
import {merge} from 'lodash';

import instances from './instances';
import items from './items';
import user from './user';


const query = `
	type Query {
		currentUser: User

		items: [Item!]!

		instances: [Instance!]!
		instance(id: ID!): Instance
	}
`;

const mutation = `
	type Mutation {
		createInstance(instance: InstanceInput!): Instance!
		updateInstance(id: ID!, instance: InstanceInput!): Instance!
	}
`;

const definition = `
	schema {
		query: Query
		mutation: Mutation
	}
`;

export default makeExecutableSchema({
	typeDefs: [
		definition,
		query,
		mutation,

		instances.schema,
		items.schema,
		user.schema
	],

	resolvers: merge(
		instances.resolvers,
		items.resolvers,
		user.resolvers
	)
});
