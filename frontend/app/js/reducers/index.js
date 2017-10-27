import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from 'history';
import apolloClient from '../apolloClient';


export default connectRouter(history)(combineReducers({
  apollo: apolloClient.reducer(),
}));
