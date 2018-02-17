import { EntryBase } from './entryType'

export default {
  Video: {
    ...EntryBase,
    provider (_, __, context) {
      return context.video.then(video => video.provider)
    },
    videoId (_, __, context) {
      return context.video.then(video => video.videoId)
    }
  }
}
