// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import bodyParser from "body-parser";
import { subscribe, execute } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import { typeDefs, resolvers } from "./schema";

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      "editor.theme": "light",
    },
  },
});

// const apolloServer = new ApolloServer({ schema });

apolloServer.applyMiddleware({ app });
app.use("/graphql", bodyParser.json());

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema,
//     // graphiql: true,
//   })
// );

const ws = createServer(app);
apolloServer.installSubscriptionHandlers(ws);

ws.listen(4000, () => {
  console.log("Apollo Server is now running on http://localhost:4000");
  console.log(apolloServer.graphqlPath);
  console.log(apolloServer.subscriptionsPath);
  new SubscriptionServer(
    { execute, subscribe, schema },
    { server: ws, path: apolloServer.subscriptionsPath }
  );
});
