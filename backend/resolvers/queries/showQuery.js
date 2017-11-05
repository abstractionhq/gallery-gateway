import Show from '../../models/show'

export function show (_, args, req) {
  return Show.findById(args.id)
}

export function shows (_, args, req) {
  return Show.findAll()
}
