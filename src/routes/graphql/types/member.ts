import { GraphQLObjectType, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeId } from '../types/uuid.js';

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: {
      type: MemberTypeId
    },
    discount: {
      type: GraphQLFloat
    },
    postsLimitPerMonth: {
      type: GraphQLInt
    }
  })
});