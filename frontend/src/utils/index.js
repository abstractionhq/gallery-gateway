export const createAction = namespace => (type, payload, message) => ({
  type,
  payload,
  error: payload instanceof Error,
  meta: {
    message,
    namespace
  }
})

export const createLoading = namespace => type => ({
  type,
  meta: {
    namespace,
    loading: true
  }
})
