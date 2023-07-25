import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberTypeId, UUIDType } from '../types/uuid.js';
import { MemberType } from './member.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: UUIDType
    },
    isMale: {
      type: GraphQLBoolean
    },
    yearOfBirth: {
      type: GraphQLInt
    },
    userId: {
      type: UUIDType
    },
    memberTypeId: {
      type: MemberTypeId
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: MemberTypeId
        }
      },
      async resolve(_, args: { id: string }) {
        const member = await prisma.memberType.findUnique({
          where: {
            id: args.id
          }
        });
        return member;
      }
    }
  })
});