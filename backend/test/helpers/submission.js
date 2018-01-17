import { parseVideo } from '../../helpers/submittion'
import { expect } from 'chai'

describe('Parse Video URL', function () {
  it('accepts valid youtube urls', function () {
    expect(parseVideo('https://www.youtube.com/watch?v=12345678901').id).to.equal('12345678901')
    expect(parseVideo('https://www.youtube.com/watch?v=12345678902').id).to.equal('12345678902')
    expect(parseVideo('http://www.youtube.com/watch?v=12345678903').id).to.equal('12345678903')
    expect(parseVideo('https://youtube.com/watch?v=12345678904').id).to.equal('12345678904')
    expect(parseVideo('http://youtube.com/watch?v=12345678905').id).to.equal('12345678905')
    expect(parseVideo('http://youtu.be/12345678906').id).to.equal('12345678906')
    expect(parseVideo('http://youtu.be/12345678906').type).to.equal('youtube')
    return Promise.resolve()
  })
  it('accepts valid vimeo urls', function () {
    expect(parseVideo('http://vimeo.com/1234').id).to.equal('1234')
    expect(parseVideo('https://vimeo.com/1234').id).to.equal('1234')
    expect(parseVideo('https://www.vimeo.com/1234').id).to.equal('1234')
    expect(parseVideo('https://player.vimeo.com/video/40004001').id).to.equal('40004001')
    expect(parseVideo('https://vimeo.com/ondemand/tinact/84954872').id).to.equal('84954872')
    expect(parseVideo('https://vimeo.com/channels/staffpicks/40004003').id).to.equal('40004003')
    expect(parseVideo('https://vimeo.com/album/3953264/video/166790295').id).to.equal('166790295')
    expect(parseVideo('https://vimeo.com/groups/motion/videos/73234724').id).to.equal('73234724')
    return Promise.resolve()
  })
})
