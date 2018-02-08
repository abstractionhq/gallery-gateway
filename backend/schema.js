import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools'

import resolvers from './resolvers'

const typeDefs = `
scalar Date

type User {
    username: ID!
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
    name: String!
    creator: User!
    participants: String!
}

input GroupInput {
    name: String!
    creatorUsername: String!
    participants: String!
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
    judges: [User]    
    createdAt: Date!
    updatedAt: Date!
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

input VoteInput {
    judgeUsername: String!
    entryId: Int!
    value: Int!
}

interface Entry {
    id: ID!
    group: Group
    student: User
    show: Show
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
}

input EntryInput {
    group: GroupInput
    studentUsername: String
    showId: Int!
    title: String!
    comment: String
    forSale: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
}

type Photo implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show!
    title: String!
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    
    path: String!
    horizDimInch: Float
    vertDimInch: Float
    mediaType: String
}

input PhotoInput {
    entry: EntryInput
    path: String!
    horizDimInch: Float!
    vertDimInch: Float!
    mediaType: String!
}

type Video implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show!
    title: String!
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    
    provider: String!
    videoId: String!
}

input VideoInput {
    entry: EntryInput
    url: String!
}

type OtherMedia implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show!
    title: String!
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    
    photoPath: String!
}

input OtherMediaInput {
    entry: EntryInput
    path: String
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
    groups: [Group]
    shows(orderBy: OrderByItem): [Show]
    votes(showId: ID!, judgeUsername: String): [Vote]
    photo(id: ID!): Photo
    video(id: ID!): Video
    otherMedia(id: ID!): OtherMedia
    photos: [Photo]
    videos: [Video]
    otherMedia: [OtherMedia]
    entries(showId: ID): [Entry]
}

type Mutation {
    createJudge(input: UserInput!): User
    updatePermissions(input: PermissionInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User

    createShow(input: ShowInput!): Show
    updateShow(id: ID!, input: ShowInput!): Show
    deleteShow(id: ID!): Boolean
    assignToShow(showId: ID!, usernames: [String]!): Boolean    
    removeFromShow(showId: ID!, usernames: [String]!): Boolean    
    
    createPhoto(input: PhotoInput!): Photo
    createVideo(input: VideoInput!): Video
    createOtherMedia(input: OtherMediaInput!): OtherMedia

    vote(input: VoteInput): Vote
}

enum SortDirection {
    ASC
    DESC
}

input OrderByItem {
    sort: String!
    direction: SortDirection!
}
`

const schema = makeExecutableSchema({typeDefs, resolvers})
// addMockFunctionsToSchema({schema});
export default schema
