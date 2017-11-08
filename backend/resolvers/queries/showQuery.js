import Show from '../../models/show'

export function show (_, args, req) {
  return Show.findById(args.id)
}

export function shows (_, args, req) {
  if (args.orderBy) {
    return Show.findAll({
      order: [[args.orderBy.sort, args.orderBy.direction]]
    })
  }

  return Show.findAll()
}
