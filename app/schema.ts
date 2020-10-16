import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const typeDefs = `
type Message {
  id: String!
  content: String!
}

type Query {
  messages: [Message!]!
}

type Subscription {
  messageCreated: Message!
}

schema {
  query: Query,
  subscription: Subscription
}
`;

export const resolvers = {
  Query: {
    messages: () => {
      return [{ id: 1, content: "hoge!" }];
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(["messageCreated"]),
    },
  },
};

setInterval(() => {
  pubsub.publish("messageCreated", {
    messageCreated: { id: 1, content: "Hello!" },
  });
}, 1000);

export default makeExecutableSchema({ typeDefs, resolvers });
