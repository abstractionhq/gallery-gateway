/* eslint-disable no-unused-vars */

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
    hometown: String
    type: UserType!
    entries: [Entry]
    shows(date: Date): [Show]
    portfolioPeriods(date: Date): [PortfolioPeriod]
}

input UserInput {
    username: String!
    firstName: String!
    lastName: String!
    displayName: String
    hometown: String
}

input PermissionInput {
    username: String!
    type: UserType
}

type Group {
    id: ID!
    creator: User!
    participants: String!
}

input GroupInput {
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
    finalized: Boolean
    entries: [Entry]
    judges: [User]
    ownVotes: [Vote]
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

type PortfolioPeriod {
    id: ID!
    portfolios: [Portfolio]
    name: String!
    description: String
    numPieces: Int!
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
    finalized: Boolean
    judges: [User]
    createdAt: Date!
    updatedAt: Date!
}

input PortfolioPeriodInput {
    name: String!
    description: String
    numPieces: Int!
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
}

input ShowUpdate {
    name: String
    description: String
    entryStart: Date
    entryEnd: Date
    judgingStart: Date
    judgingEnd: Date
    entryCap: Int
    finalized: Boolean
}

type Vote {
    id: ID!
    judge: User
    entry: Entry
    value: Int!
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
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean
}

input EntryInput {
    group: GroupInput
    studentUsername: String
    showId: Int!
    title: String!
    comment: String
    forSale: Boolean
    hometown: String
    displayName: String
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
}

input EntryUpdate {
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    excludeFromJudging: Boolean
}

type Photo implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show!
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

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

type Portfolio {
    id: ID!
    portfolioPeriod: PortfolioPeriod
    student: User
    yearLevel: String
    academicProgram: String
    pieces: [Piece]
    submitted: Boolean
    createdAt: Date!
    updatedAt: Date!
}

interface Piece {
    id: ID!
    portfolio: Portfolio
    title: String
    comment: String
    pieceType: String
}

type PhotoPiece implements Piece {
    id: ID!
    portfolio: Portfolio
    title: String
    comment: String
    pieceType: String

    path: String!
    horizDimInch: Float
    vertDimInch: Float
    mediaType: String
}

input PieceInput {
    studentUsername: String!
    portfolioId: Int
    title: String!
    comment: String
    yearLevel: String
    academicProgram: String
    entryType: String
    periodId: Int
}

input PortfolioPhotoInput {
    piece: PieceInput
    path: String!
    horizDimInch: Float!
    vertDimInch: Float!
    mediaType: String!
}

input PortfolioVideoInput {
    piece: PieceInput
    url: String!
}

input PortfolioOtherMediaInput {
    piece: PieceInput
    path: String
}

type Video implements Entry {
    id: ID!
    group: Group
    student: User
    show: Show!
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

    provider: String!
    videoId: String!
}

type VideoPiece implements Piece {
    id: ID!
    portfolio: Portfolio
    title: String
    comment: String
    pieceType: String

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
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

    path: String!
}

type OtherMediaPiece implements Piece {
    id: ID!
    portfolio: Portfolio
    title: String
    comment: String
    pieceType: String
    
    path: String!
}

input OtherMediaInput {
    entry: EntryInput
    path: String
}

type Scholarship{
    id: ID!
    name: String!
    description: String!
    requiredPhotos: Int!
    fulltime: Boolean!
    renewable: Boolean!
    requiresEssay: Boolean!
    gpa: Float
    yearStatus: String
    degreePrograms: String
}

input ScholarshipInput{
    name: String!
    description: String!
    requiredPhotos: Int!
    fulltime: Boolean!
    renewable: Boolean!
    requiresEssay: Boolean!
    gpa: Float
    yearStatus: String
    degreePrograms: String
}

enum UserType {
    STUDENT
    ADMIN
    JUDGE
}

type Query {
    self: User
    user(id: ID!): User
    users(type: UserType): [User]
    group(id: ID!): Group
    show(id: ID!): Show
    groups: [Group]
    shows(orderBy: OrderByItem, studentUsername: String): [Show]
    portfolio(id: ID!): Portfolio
    portfolioByPeriod(periodId: ID!, studentUsername: String): Portfolio
    portfoliosByStudent(orderBy: OrderByItem, studentUsername: String): [Portfolio]
    portfolioPeriod(id: ID!): PortfolioPeriod
    portfolioPeriods(orderBy: OrderByItem, studentUsername: String): [PortfolioPeriod]
    vote(entryId: ID!, judgeUsername: String!): Vote
    votes(showId: ID!, judgeUsername: String): [Vote]
    photo(id: ID!): Photo
    video(id: ID!): Video
    otherMedia(id: ID!): OtherMedia
    openPortfolioPeriod(studentUsername: String!): PortfolioPeriod
    entry(id: ID!): Entry
    entries(showId: ID, studentUsername: String): [Entry]
}

type Mutation {
    createJudge(input: UserInput!): User
    createAdmin(input: UserInput!): User
    updatePermissions(input: PermissionInput!): User
    updateUser(input: UserInput!): User
    deleteUser(id: ID!): User

    createShow(input: ShowInput!): Show
    updateShow(id: ID!, input: ShowUpdate!): Show
    deleteShow(id: ID!): Boolean
    assignToShow(showId: ID!, usernames: [String]!): Boolean
    removeFromShow(showId: ID!, usernames: [String]!): Boolean

    assignToPortfolioPeriod(portfolioPeriodId: ID!, usernames: [String]!): Boolean
    removeFromPortfolioPeriod(portfolioPeriodId: ID!, usernames: [String]!): Boolean

    createPortfolioPeriod(input: PortfolioPeriodInput!): PortfolioPeriod

    createPhoto(input: PhotoInput!): Show
    createPortfolioPhoto(input: PortfolioPhotoInput!): Portfolio
    createVideo(input: VideoInput!): Show
    createPortfolioVideo(input: PortfolioVideoInput!): Portfolio
    createOtherMedia(input: OtherMediaInput!): Show
    createPortfolioOtherMedia(input: PortfolioOtherMediaInput!): Portfolio
    updateEntry(id: ID!, input: EntryUpdate!): Entry

    createScholarship(input: ScholarshipInput!): Scholarship
    deletePiece(id: ID!): Boolean

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

// NOTE: Uncomment in development to have schema endpoints mocked
// addMockFunctionsToSchema({schema})

export default schema
