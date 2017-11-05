import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
} from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `
scalar Date

type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    displayName: String
    type: UserType!
    entries: [Entry]
    shows: [Show]
}

input UserInput {
    username: String!
    firstName: String!
    lastName: String!
    displayName: String
}

input PermissionInput {
    username: String!
    type: UserType
}

type Group {
    id: ID!
    name: String
    students: [User]
}

type Show {
    id: ID!
    name: String!
    description: String
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
    entryCap: Int!
    entries: [Entry]
}

input ShowInput {
    name: String!
    description: String
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
    entryCap: Int!
}

type Vote {
    id: ID!
    judge: User
    entry: Entry
}


interface Entry {
    id: ID!
    group: Group
    student: User
    show: Show
    comment: String
    forSale: Boolean
}

type Photo implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show
    photoPath: String
    horizDimInch: Float
    vertDimInch: Float
    comment: String
    media: String
    moreCopies: Boolean
    forSale: Boolean
}

type Video implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show
    videoURL: String
    comment: String
    forSale: Boolean
}

type OtherMedia implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show
    photoPath: String
    comment: String
    moreCopies: Boolean
    forSale: Boolean
}

enum UserType {
    STUDENT
    ADMIN
    JUDGE
}

type Query {
    user(id: ID!): User
    users(type: UserType): [User]
    group(id: ID!): Group
    show(id: ID!): Show
    vote(id: ID!): Vote
    groups: [Group]
    shows: [Show]
    votes: [Vote]
    photo(id: ID!): Photo
    video(id: ID!): Video
    otherMedia(id: ID!): OtherMedia
    photos: [Photo]
    videos: [Video]
    otherMedia: [OtherMedia]
    entries: [Entry]
}

type Mutation {
    createJudge(input: UserInput!): User
    updatePermissions(input: PermissionInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User

    createShow(input: ShowInput!): Show
    updateShow(id: ID!, input: ShowInput!): Show
    deleteShow(id: ID!): Boolean
}
`;

const schema = makeExecutableSchema({typeDefs, resolvers});
//addMockFunctionsToSchema({schema});
export default schema;

