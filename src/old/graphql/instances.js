import {
	findAllInstances,
	findInstance,

	createInstance,
	updateInstance
} from '../controllers/instances';

const schema = `
	type Boss {
		wowId: String!
		name: String!
	}

	type Instance {
		id: ID!
		wowId: String!
		name: String!
		created: String!
		updated: String!
		bosses: [Boss!]!
	}


	input BossInput {
		wowId: String!
		name: String!
	}

	input InstanceInput {
		wowId: String!
		name: String!
		bosses: [BossInput!]!
	}
`;

const resolvers = {
	Query: {
		instances: findAllInstances,
		instance: findInstance
	},

	Mutation: {
		createInstance,
		updateInstance
	}
};

export default {
	resolvers,
	schema
};
