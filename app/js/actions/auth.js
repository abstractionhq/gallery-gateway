import * as utils from './utils';

export const AUTH = 'AUTH';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

const createAction = utils.createAction(AUTH);

// Todo finish this
// export function signIn(googleUser) {
//   return (dispatch, getState) => {
//     const info = {
//       token: googleUser.getAuthResponse().id_token,
//       id: googleUser.getBasicProfile().getEmail().split('@')[0],
//     };
//     //fetch api/v1/auth/login, pass in token
//   };
// }

export function checkLogin() {
  return (dispatch, getState, { Auth, Officers }) => (
    Auth.checkToken().then(user => (
      Officers.all({ active: new Date() }, true).then((data) => {
        const officer = data.find(o => o.userDce === user.dce);
        return {
          user,
          officer,
        };
      })
    ))
      .then(user => dispatch(createAction(SIGN_IN, user)))
      .catch(() => dispatch(createAction(SIGN_OUT)))
  );
}

export function signOut() {
  return (dispatch, getState, { Auth }) => Promise
    .all([Auth.signOut(), gapi.auth2.getAuthInstance().signOut()])
    .then(() => dispatch(createAction(SIGN_OUT)))
    .catch(error => dispatch(createAction(SIGN_OUT, error)));
}
