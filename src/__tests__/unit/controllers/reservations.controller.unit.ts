import {
  expect
} from '@loopback/testlab';

describe('ProductController (unit)', () => {

  describe('uselessTest', () => {
    it('checks if true', async () => {
      let result;
      const condition = true;
      if (condition) {
        result = true
      }
      expect(result).to.eql(result);
    });
  });
});
