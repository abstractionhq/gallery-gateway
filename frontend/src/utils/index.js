import MD5 from 'md5.js'

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

/**
 * Performs a repeatable shuffle
 * @param {string} key the shuffle's unique keying which determines order
 * @param {[any]} arr the array to shuffle
 * @param {Function} identifier function that extracts the ID from an array element
 * @returns {[any]} the shuffled array
 */
export function repeatableShuffle (key, arr, identifier) {
  // make a copy of the array so the original is unmodified
  arr = arr.slice()
  // first we sort everything by its identifier, to ensure stability of
  // following shuffle
  arr.sort((a, b) => {
    const idA = identifier(a)
    const idB = identifier(b)
    return idA > idB ? 1 : idA === idB ? 0 : -1
  })
  // modified knuth-shuffle
  for (let i = 0; i < arr.length - 1; i++) {
    const hash = new MD5().update(`${key}${identifier(arr[i])}`).digest()
    // use hash to generate 'j' such that i <= j < NUM_ELEMS
    const range = arr.length - i - 1
    const j = i + hash.readUInt32LE(0) % range
    // swap elems[i], elems[j]
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}
