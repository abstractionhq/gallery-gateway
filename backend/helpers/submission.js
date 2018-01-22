export function allowedToSubmit (args, req) {
  // TODO update the below to account for group submission rights
  return req.auth.username !== undefined && req.auth.username === args.input.entry.studentUsername
}

export function parseVideo (url) {
  // /^(?:https?:\/\/|\/\/)? | Optional URL scheme. Either http, or https, or protocol-relative
  // (?:www\.|m\.)?          | Optional www or m subdomain
  // (?:                     | Group for host alternatives
  //   youtu\.be\/           |   Either youtu.be
  //   |youtube\.com\/       |   or youtube.com
  //     (?:                 |   Group for path alternatives
  //       embed\/           |     Either /embed/
  //       |v\/              |     or /v/
  //       |watch\?v=        |     or /watch?v=
  //       |watch\?.+&v=     |     or /watch?other_param&v=
  //     )                   |   End path alternatives
  // )                       | End host alternatives
  // ([\w-]{11})             | 11 characters (Length of YouTube video ids)
  // (?![\w-])/              | Rejects if id is too long
  // i                       | Case-insensitive
  // See: http://stackoverflow.com/a/10524505
  const YouTubeRegex = /^(?:https?:\/\/|\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?![\w-])/i

  // /^(?:https?:\/\/|\/\/)?            | Optional URL scheme. Either http, or https, or protocol-relative
  // (?:www\.|player\.)?                | Optional www or player subdomain
  // vimeo.com\/                        | vimeo.com/
  // (?:                                | Group for words before video id
  //    (?:.*videos?\/)                 |     video/ or videos/ with anything before them
  //    |(?:(?:channels|ondemand).+\/)  |     or channels with anything after or ondemand with anything after up to /
  // )?                                 | Match 0 or 1 of them
  // (\d+)/                             | Id's are numeric, start at 1, and increment
  // i                                  | Case-insensitive
  const VimeoRegex = /^(?:https?:\/\/|\/\/)?(?:www\.|player\.)?vimeo.com\/(?:(?:.*videos?\/)|(?:(?:channels|ondemand).+\/))?(\d+)/i

  const YouTubeMatches = url.match(YouTubeRegex)
  const VimeoMatches = url.match(VimeoRegex)

  if (YouTubeMatches && YouTubeMatches[1]) {
    return {
      type: 'youtube',
      id: YouTubeMatches[1]
    }
  } else if (VimeoMatches && VimeoMatches[1]) {
    return {
      type: 'vimeo',
      id: VimeoMatches[1]
    }
  } else {
    return {}
  }
}
