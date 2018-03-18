import SubmissionQuery from './queries/submission.graphql'
import SubmissionsQuery from './queries/submissions.graphql'
import ShowVotes from './queries/showVotes.graphql'
import GetVote from './queries/entryVote.graphql'

export const FETCH_SUBMISSION = 'FETCH_SUBMISSION'
export const FETCH_SUBMISSIONS = 'FETCH_SUBMISSIONS'
export const FETCH_VOTES = 'FETCH_VOTES'
export const FETCH_VOTE = 'FETCH_VOTE'
export const NEXT_IN_QUEUE = 'NEXT_IN_QUEUE'
export const PREVIOUS_IN_QUEUE = 'PREVIOUS_IN_QUEUE'

export const fetchSubmission = submissionId => (dispatch, getState, client) => {
  return client
    .query({
      query: SubmissionQuery,
      variables: {
        id: submissionId
      }
    })
    .then(({ data: { submission } }) =>
      dispatch({ type: FETCH_SUBMISSION, payload: submission })
    )
    .catch(console.error) // TODO: Handle the error
}

export const fetchSubmissions = showId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()
  return client
    .query({
      query: SubmissionsQuery,
      variables: {
        id: showId
      }
    })
    .then(({ data: { submissions } }) =>
      dispatch({ type: FETCH_SUBMISSIONS, payload: { submissions, username } })
    )
    .catch(console.error) // TODO: Handle the error
}

export const fetchVotes = showId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()
  return client
    .query({
      query: ShowVotes,
      variables: {
        showId,
        username
      }
    })
    .then(({ data: { votes } }) =>
      dispatch({ type: FETCH_VOTES, payload: votes })
    )
    .catch(console.error) // TODO: Handle the error
}

export const fetchVote = submissionId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()
  return client
    .query({
      query: GetVote,
      variables: {
        entryId: submissionId,
        username
      }
    })
    .then(({ data: { vote } }) =>
      dispatch({ type: FETCH_VOTE, payload: vote })
    )
    .catch(console.error) // TODO: Handle the error
}

export const nextInQueue = id => (dispatch, getState, client) => {
  dispatch({ type: NEXT_IN_QUEUE, payload: { id } })
}

export const previousInQueue = id => (dispatch, getState, client) => {
  dispatch({ type: PREVIOUS_IN_QUEUE, payload: { id } })
}
