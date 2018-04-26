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

We followed a Distributed Scrum process with sprints lasting two weeks. We conducted daily stand-ups over [Slack](https://slack.com/) and used [ZenHub](https://www.zenhub.com/) to manage our backlog of stories. Before each sprint, we met to triage, plan, and point stories, and after each sprint, we held a retrospective meeting. We met with our sponsor weekly to verify and validate requirements, whiteboard interface designs, and demo progress. We tracked our time using [Toggl](https://toggl.com/).

Our two primary metrics were Velocity and Code Coverage.

See our [Interim Presentation](https://youtu.be/iLT2T8WT80Q?t=28m20s) and [Final Presentation](https://youtu.be/1mFXTtoqFw8?t=1h3m52s) for more details.

## Architecture

Both the frontend and backend are written in JavaScript.

Frontend:

- [React](https://reactjs.org/) for view rendering
- [Redux](https://redux.js.org/) for state management
- [React Router](https://reacttraining.com/react-router/) v4 for page routing
- [Apollo Client](https://github.com/apollographql/apollo-client) for GraphQL querying and data caching
- [Boostrap](http://getbootstrap.com/) v4 (via [reactstrap](https://reactstrap.github.io/)) & [styled-components](https://www.styled-components.com/) for styling
- [Formik](https://github.com/jaredpalmer/formik) w/ [yup](https://github.com/jquense/yup) for forms
- [Webpack](https://webpack.js.org/) for compiling our app and bundling assets together

Backend:

- [Express](https://expressjs.com/) as our web framework w/ [Apollo Server](https://github.com/apollographql/apollo-server) as our GraphQL server
- [Sequelize](http://docs.sequelizejs.com/) as our ORM w/ [MySQL](https://www.mysql.com/) (>= 5.7) as our database
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
- [How to GraphQL](https://www.howtographql.com/)
- [The GitHub GraphQL API](https://githubengineering.com/the-github-graphql-api/)
- [From REST to GraphQL](https://0x2a.sh/from-rest-to-graphql-b4e95e94c26b) by Jacob Gillespie
- [awesome-graphql](https://github.com/chentsulin/awesome-graphql)

## Development

You'll need to be running both the frontend and backend for development. Check out each of their README's for further instructions.

## Deployment

We deploy our application on Ubuntu 16.04.

### Prequisites

Install Node (8.x LTS) & NPM (>= 5.6)

```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install Yarn (>= 1.6)

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn
```

[Nginx](https://nginx.org/en/) and [Supervisor](http://supervisord.org/) must be installed and running.

Additionally, setup HTTPS using [Let's Encrypt](https://letsencrypt.org/).

### Deploy the App

Run our `deploy/deploy.sh` script.

It will:
- Create a MySQL database if one does not exist (and set the character encoding to UTF-8)
- Download this project's source from GitHub
- Install and build the frontend
- Install and build the backend
- Migrate the database tables
- Start the backend using Supervisor

You will need to provide the MySQL database password, RSA keys used for JWT authentication (see below), and the Identity Provider Certificate.

```sh
cd /opt/node/gallerygateway/keys
sudo openssl genrsa -out private.key 4096
sudo openssl rsa -in private.key -outform PEM -pubout -out public.key
```

## Maintenance

Because the JavaScript community tends to move faster than other language communities, this app will require regular maintenance to make sure it can run on the current LTS [Node.js](https://nodejs.org/en/) runtime. Additionally, [npm](http://npmjs.com/) packages this app depends on should be periodically monitored, including updating to their latest stable versions (possibly even switching packages if the current maintainer abandons support).

Package dependencies will generally only need to be updated if packages contain security vulnerabilities or you will be developing additional features or upgrading Node versions. When running `npm install` or `yarn install`, you generally will be warned of deprecated package versions. It is recommended to also install [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) and run `ncu` to check which packages are out-of-date. Then, read through the `CHANGELOG`s of each out-dated package (they're usually found on the package's npm page or GitHub repo) to see if there are any breaking changes. If there are, update any of this project's code impacted by the breaking changes and update the version of the package in the corresponding `package.json` file. Double check that the upgrade is compatible by making sure that all existing tests pass (Note: frontend updates that impact styling will likely need to be manually tested).

Determining the health of a package is subjective but usually involves identifying when its most recent commits were, how active the maintainers are in responding to Issues and Pull Requests, and the number of Issues and Pull Requests the project has. Additionally, new packages may be developed which offer similar features to a package we use, but because of non-functional characteristics (e.g. performance, user experience), the JavaScript community may collectively favor this new package over the old and recommend switching. A word of caution; though, beware of hype-driven development – it plagues the JavaScript community.

[Node.js LTS releases](https://github.com/nodejs/Release#release-schedule) are cut every year in April. Upgrading Node versions involves updating any uses of deprecated [Node API](https://nodejs.org/dist/latest/docs/api/) calls and making sure that all npm dependencies are compatible with the new Node version.

Changes to ECMAScript are generally backwards compatible, so it is unlikely that the language syntax will need maintenance. However, since we currently rely on [Babel](https://babeljs.io/) to transpile down to what's supported in major browsers and Node, Babel may need to be periodically updated. Ideally, Babel could be removed when the language features we're using are [supported natively](http://kangax.github.io/compat-table/es2016plus/) in all major browsers and Node.
