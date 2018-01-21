export function allowedToSubmit (args, req) {
  // TODO update the below to account for group submission rights
  return req.auth.username !== undefined && req.auth.username === args.input.entry.studentUsername
}

export function parseVideo (url) {
  url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|album\/\w+\/\w+\/|groups\/\w+\/\w+\/|channels\/\w+\/|ondemand\/\w+\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
  let type
  if (RegExp.$3.indexOf('youtu') > -1) {
    type = 'youtube'
  } else if (RegExp.$3.indexOf('vimeo') > -1) {
    type = 'vimeo'
  }
  return { type: type, id: RegExp.$6 }
}
