import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

const prisma = new PrismaClient();

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType
    },
    name: {
      type: GraphQLString
    },
    balance: {
      type: GraphQLFloat
    },
    profile: {
      type: ProfileType,
      async resolve(_, id: string ) {
        try {
          const profile = await prisma.profile.findUnique({
            where: {
              userId: id
            }
          });
          return profile;
        } catch {
          return null;
        }
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(_, id: string ) {
        try {
          const posts = await prisma.post.findMany({
            where: {
              authorId: id
            }
          });
          return posts;
        } catch {
          return null;
        }
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      args: {
        id: {
          type: UUIDType
        }
      },
      async resolve(_, args: { id: string }) {
        return await prisma.user.findMany({
          where: { 
            subscribedToUser: { 
              some: {
                subscriberId: args.id,
              },
            } 
          }
        });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      args: {
        id: {
          type: UUIDType
        }
      },
      async resolve(_, args: {id: string}) {
        await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: args.id
              }
            }
          }
        });
      }
    }
  })
});