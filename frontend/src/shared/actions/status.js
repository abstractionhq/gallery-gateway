export const LOADING_STATUS = 'LOADING_STATUS'
export const ERROR_STATUS = 'ERROR_STATUS'
export const CLOSE_STATUS = 'CLOSE_STATUS'
export const WARNING_STATUS = 'WARNING_STATUS'

export function closeStatus () {
  return {
    type: CLOSE_STATUS
  }
}
