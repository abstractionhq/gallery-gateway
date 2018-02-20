# Gallery Gateway

![Gallery Gateway Logo](https://user-images.githubusercontent.com/13719429/36440348-8d156e20-163d-11e8-8462-dfe4ba840a41.png)

## About

### Motivation

The [RIT](https://www.rit.edu/) [School of Photographic Arts and Sciences (SPAS)](http://cias.rit.edu/schools/photographic-arts-sciences) holds an annual art exhibition highlighting the top works of RIT student artists. Students can submit works for consideration during an open call, and a panel of RIT faculty jurors vote on which art will be displayed in the gallery at this show. Currently, SPAS has been paying for and using a software as a service product, [CaFÉ](https://www.callforentry.org/), to facilitate this process; however, frustrations with CaFÉ’s difficult-to-use interface and poor user-experience for both administrative and student workflows has led them to seek custom replacement software which better fits their use case and work process.

Gallery Gateway is this custom replacement software.

### Team

Gallery Gateway was built as a Senior Project for RIT's [Software Engineering Undergraduate Program](http://www.se.rit.edu/) during the Fall 2017 and Spring 2018 semesters.

It was built by [Team A B S T R A C T I O N](http://www.se.rit.edu/~abstraction/), whose members were [Kayla Davis](https://github.com/kayladavis), [Bill Dybas](https://github.com/billdybas), [Robert McLaughlin](https://github.com/robmcl4), and [Tina Howard](https://github.com/chtinahow).

The project was sponsored by Nanette Salvaggio and coached by Bill Stumbo.

### Process

_TODO_ Mention our Scrum process, tools we used, deliverables we made

## Architecture

Both the frontend and backend are written in JavaScript.

Frontend:

- [React](https://reactjs.org/) for view rendering
- [Redux](https://redux.js.org/) for state management
- [React Router](https://reacttraining.com/react-router/) v4 for page routing
- [Apollo Client](https://github.com/apollographql/apollo-client) for GraphQL querying and data caching
- [Boostrap](http://getbootstrap.com/) v4 (via [reactstrap](https://reactstrap.github.io/)) & [styled-components](https://www.styled-components.com/) for styling
- [Formik](https://github.com/jaredpalmer/formik) w/ [yup](https://github.com/jquense/yup) for forms

Backend:

- [Express](https://expressjs.com/) as our web framework w/ [Apollo Server](https://github.com/apollographql/apollo-server) as our GraphQL server
- [Sequelize](http://docs.sequelizejs.com/) as our ORM w/ [MySQL](https://www.mysql.com/) as our database
- [Passport](http://www.passportjs.org/) w/ [Passport SAML](https://github.com/bergie/passport-saml) for external user authentication
- [JWT](https://jwt.io/) for API authentication & short lived tokens
- [Multer](https://github.com/expressjs/multer) for file uploads

See each of their `package.json` files for the other tools we used (eg. transpiling, linting, testing).

### New to React, Redux, & GraphQL?

Here are some useful resources on these tools and our architecture:

#### React

- [The Beginner's Guide to ReactJS](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) by Kent C. Dodds
- [the Road to learn React](https://roadtoreact.com/)
- [React Express](http://www.react.express/)
- [awesome-react](https://github.com/enaqx/awesome-react)
- [react-redux-links](https://github.com/markerikson/react-redux-links) by Mark Erikson
- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) by Dan Abramov
- [Simple React Patterns](http://lucasmreis.github.io/blog/simple-react-patterns/) by Lucas Reis
- [Fullstack React](https://www.fullstackreact.com/)
- [React for Beginners](https://reactforbeginners.com/) by Wes Bos
- [Advanced React](https://courses.totalreact.com/p/advanced-react-free) by Ryan Florence

#### Redux

- [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) by Dan Abramov
- [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) by Dan Abramov
- [A cartoon intro to Redux](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6) by Lin Clark
- [Live React: Hot Reloading with Time Travel](https://www.youtube.com/watch?v=xsSnOQynTHs) by Dan Abramov
- [10 Tips for Better Redux Architecture](https://medium.com/javascript-scene/10-tips-for-better-redux-architecture-69250425af44) by Eric Elliott
- [Learn Redux](https://learnredux.com/) by Wes Bos

#### GraphQL

- [GraphQL](http://graphql.org/)
- [Apollo GraphQL](https://www.apollographql.com/)
- [Apollo Developers Blog](https://dev-blog.apollodata.com/)
- [The GitHub GraphQL API](https://githubengineering.com/the-github-graphql-api/)
- [From REST to GraphQL](https://0x2a.sh/from-rest-to-graphql-b4e95e94c26b) by Jacob Gillespie
- [awesome-graphql](https://github.com/chentsulin/awesome-graphql)

## Development

You'll need to be running both the frontend and backend for development. Check out each of their README's for further instructions.

## Deployment

_TODO_
