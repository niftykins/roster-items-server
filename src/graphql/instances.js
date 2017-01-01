import CODES from '../constants/codes';

import Instances from '../models/instances';

const schema = `
	type Boss {
		wowId: String!
		name: String!
	}

	type Instance {
		id: ID!
		wowId: String!
		name: String!
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
		instances() {
			return Instances.findAll();
		},

		instance(root, {id}) {
			return Instances.findById(id);
		}
	},

	Mutation: {
		async createInstance(root, {instance}, context) {
			if (!context.user) {
				throw new Error('Must be logged in to create an instance');
			}

			try {
				return Instances.insert(instance);
			} catch (e) {
				if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
					throw new Error('Instance with that ID already exists');
				}

				throw new Error('Well something went badly');
			}
		},

		async updateInstance(root, {id, instance}, context) {
			if (!context.user) {
				throw new Error('Must be logged in to update an instance');
			}

			try {
				return Instances.update(id, instance);
			} catch (e) {
				console.log(e);
				if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
					throw new Error('Instance with that ID already exists');
				}

				throw new Error('Well something went badly');
			}
		}
	}
};

export default {
	resolvers,
	schema
};
