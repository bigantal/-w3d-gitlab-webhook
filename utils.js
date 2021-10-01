const utils = {

  findJiraId: function (s) {
    if (!s) {
      return null;
    }
    const jira_matcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;
    s = s.split("").reverse().join("")
    const m = s.match(jira_matcher);
    if (!m) {
      return null;
    }
    for (let i = 0; i < m.length; i++) {
      m[i] = m[i].split("").reverse().join("")
    }
    m.reverse()
    if (m.length > 0) {
      return m[0];
    }
    return null;
  }

};

module.exports = utils;
