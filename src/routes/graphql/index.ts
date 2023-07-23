import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const query = req.body.query;
      const variables = req.body.variables;
      const {data, errors} = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
      });
      return { data, errors }
    }
  });
};

export default plugin;
