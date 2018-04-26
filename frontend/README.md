# Gallery Gateway Frontend

## Getting Started

### Prerequisites

You'll need [Node](https://nodejs.org/en/download/) >= 8.x and [Yarn](https://yarnpkg.com/en/docs/install) >= 1.6 to be installed.

### Installation

1. Install dependencies: `yarn install`
2. Start the development server: `yarn start`
3. Visit `http://localhost:5000` in your favorite browser

_NOTE: When running the server, you may see warnings about the 'history' package. You can safely ignore them._

## Development

In development, our app assumes that you will be running the GraphQL API on `http://localhost:3000`.

The frontend is split up into three main sections: `Admin`, `Judge`, and `Student`.

In each, we have:
- `actions.js` - Redux actions and action creators
- `Page.js` - Top-level routing for this section
- `reducers.js` - Redux reducer for this section
- `components/` - Presentational components (which may also manage their own internal React state)
- `containers/` - Container components which wrap presentational components with Redux and GraphQL functions
- `mutations/` - GraphQL mutations
- `pages/` - Layout for each page in this section
- `queries/` - GraphQL queries

Since Admin, Judge, and Student workflows are generally mutually exclusive, we aim for minimal overlap between each section.

We transpile our code using [Babel](https://babeljs.io/) and target IE 11 because there are still computers at RIT which run Windows 7 and IE 11.

[ESLint](https://eslint.org/) is setup to warn you about style violations. Additionally, you should run `yarn run format` to automatically format the code using [Prettier](https://prettier.io/).

## Testing

To run tests, run `yarn run test`. We use the testing libraries [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/).

## Deployment

This app assumes that the backend GraphQL API will be deployed at `https://gallerygateway.rit.edu/backend`.

We use [Webpack](https://webpack.js.org/) to compile our application. Our Webpack configuration files can be found in `config/`

To build the app for production, run `yarn run build`. This will create a `dist/` folder with the compiled output files.

To test that the compiled app is working correctly, you'll need to host the assets on a static server. The npm package [`serve`](https://www.npmjs.com/package/serve) can be used to do this locally.

In production, we host our static files using [nginx](https://nginx.org/en/). You can find our nginx config in our `deploy/` folder.
