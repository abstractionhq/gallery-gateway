import Entry from '../../models/entry'
import { UserError } from 'graphql-errors'
import { ADMIN, IMAGE_ENTRY } from '../../constants'

export function entries (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Entry.findAll({where: args}).each((entry) => {
    entry.student = entry.getUser()
    entry.group = entry.getGroup()

    if (entry.entryType === IMAGE_ENTRY) {
      return entry.getImage().then((image) => {
        return Object.assign(entry, image.dataValues)
      })
    } else {
      throw new Error('unknown entry type')
    }
  })
}
