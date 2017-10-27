import history from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
