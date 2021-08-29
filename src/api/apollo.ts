import { ApolloClient, InMemoryCache } from "@apollo/client";
import { loadConfigSync } from "graphql-config";
import { SchemaLink } from "@apollo/client/link/schema";

const config = loadConfigSync({ configName: "spacex" });
const schema = config.getProject().getSchemaSync();

const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema }),
});

export default client;
