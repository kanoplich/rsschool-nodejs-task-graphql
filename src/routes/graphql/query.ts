import { GraphQLObjectType, GraphQLSchema, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId, UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType } from './types/member.js';

const prisma = new PrismaClient();

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: {
      type: UserType as GraphQLObjectType,
      args: {
        id: {
          type: UUIDType
        }
      },
      async resolve(_, args: { id: string }) {
        const user = await prisma.user.findUnique({
          where: {
            id: args.id
          }
        });
        return user;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        const users = await prisma.user.findMany();
        return users;
      }
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: UUIDType
        }
      },
      async resolve(_, args: { id: string }) {
        const post = await prisma.post.findUnique({
          where: {
            id: args.id
          }
        });
        return post;
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve() {
        const posts = await prisma.post.findMany();
        return posts;
      }
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: UUIDType
        }
      },
      async resolve(_, args: { id: string }) {
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id
          }
        });
        return profile;
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      async resolve() {
        const profiles = await prisma.profile.findMany();
        return profiles;
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: MemberTypeId
        }
      },
      async resolve(_, args: { id: string }) {
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: args.id
          }
        });
        return memberType;
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      async resolve() {
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes;
      }
    },
  })
});

export const schema = new GraphQLSchema({
  query: RootQueryType
});