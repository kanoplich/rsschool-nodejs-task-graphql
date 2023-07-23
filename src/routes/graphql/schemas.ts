import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId, UUIDType } from './types/uuid.js';

const prisma = new PrismaClient();

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType)
    },
    name: {
      type: GraphQLString
    },
    balance: {
      type: GraphQLFloat
    }
  })
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType)
    },
    isMale: {
      type: GraphQLBoolean
    },
    yearOfBirth: {
      type: GraphQLInt
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType)
    },
    title: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    }
  })
});

const MemberType = new GraphQLObjectType({
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

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType)
        }
      },
      async resolve(_, args: {id: string}) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: args.id
            }
          });
          return user;
        } catch {
          return null;
        }
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        const users = await prisma.user.findMany();
        return users;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQueryType
});