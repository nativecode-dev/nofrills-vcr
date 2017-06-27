const expect = require('chai').expect
const vcr = require('../lib')

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
  })
})
