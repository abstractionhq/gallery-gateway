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

export const parseId = (str) => {
  const result = parseInt(str, 10)
  if (isNaN(result)) {
    // str is not a number so give it back
    return str
  }

  return result
}
