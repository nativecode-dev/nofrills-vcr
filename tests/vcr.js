const expect = require('chai').expect
const vcr = require('../lib/vcr')

describe('when using Logger', () => {
  const namespace = 'test::mock'
  describe('with mock logwriter', () => {
    it('should write to mock logwriter', (done) => {
      const mock = (frame) => {
        expect(frame.tag).to.equal(`${namespace}:info`)
        expect(frame.args[0]).to.equal('test')
        done()
      }
      const sut = new vcr.VCR(namespace).use(mock)
      sut.info('test')
    })

    it('should use custom formatting', (done) => {
      const formatter = (args) => args.map(arg => {
        return { message: arg}
      })
      const mock = (frame) => {
        expect(frame.args[0].message).to.equal('test')
        done()
      }
      const sut = new vcr.VCR(namespace).formatter(formatter).use(mock)
      sut.info('test')
    })
  })
})
