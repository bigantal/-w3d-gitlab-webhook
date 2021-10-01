const assert = require('assert');
const findJiraId = require('../utils.js').findJiraId;

describe('Jira', () => {
  describe('match', () => {
    it('should find', () => {
      const input = "RTEP-104-crud-api-implementation"
      assert.equal(findJiraId(input), "RTEP-104");
    });
    it('should find 2', () => {
      const input = "RTEP-105-crud-api-implementation"
      assert.equal(findJiraId(input), "RTEP-105");
    });
    it('should find 3', () => {
      const input = "RTEP-1-crud-api-implementation"
      assert.equal(findJiraId(input), "RTEP-1");
    });
    it('should find 4', () => {
      const input = "RTEP-9999-crud-api-implementation"
      assert.equal(findJiraId(input), "RTEP-9999");
    });
  });

  describe('no match', () => {
    it('no match 1', () => {
      const input = "crud-api-implementation"
      assert.equal(findJiraId(input), null);
    });
    it('no match 2', () => {
      const input = null;
      assert.equal(findJiraId(input), null);
    });
    it('no match 3', () => {
      const input = undefined;
      assert.equal(findJiraId(input), null);
    });
  });
});
