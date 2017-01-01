import Items from '../models/items';

const schema = `
	type ItemAllowed {
		melee: [Int!]!
		ranged: [Int!]!
		healers: [Int!]!
		tanks: [Int!]!
	}

	type Item {
		id: ID!
		wowId: String!
		name: String!
		sourceId: String!
		slot: String!
		icon: String!

		allowed: ItemAllowed!
	}
`;

const resolvers = {
	Query: {
		items() {
			return Items.findAll();
		}
	}
};

export default {
	resolvers,
	schema
};
