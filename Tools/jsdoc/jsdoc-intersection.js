/**
 * Converts TypeScript intersection types (joined with an "&") to a JSDoc type union "|" allowing the file to be
 * processed downstream. This allows you to use the amperstand "&" in your code.
 *
 * Specifically, this creates a compatibility between Visual Studio Code's TypeScript documentation and JSDoc, as
 * Visual Studio Code's parser uses amperstands for type unions, and JSDoc uses pipes.
 * {@link https://github.com/chriseaton/jsdoc-plugin-typescript-new}
 * {@link https://github.com/jsdoc/jsdoc/issues/1199}
 *
 * test failed
 *
 * @module intersection
 */
exports.handlers = {
  jsdocCommentFound(jsdocComment, parser) {
    // console.log(jsdocComment);
    const tags = ['typedef', 'extends', 'type', 'mixes', 'property', 'prop', 'param', 'typedef', 'returns'];
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of tags) {
      const r = new RegExp(`(.*@${tag}\\s*\\{.*)(new\\s*\\(.*?\\))(\\s*=>\\s(?:(?:\\((.+)\\))|(?:(.+))))?.*\\}`, 'gm');
      let match = r.exec(jsdocComment.comment);
      // console.log(match)
      while (match && match.length) {
        const before = {
          index: 0,
          length: match.index + match[1].length,
          chunk: null,
        };
        before.chunk = jsdocComment.comment.substr(before.index, before.length);
        const after = {
          index: before.length + match[2].length + (match.length > 3 && match[3] ? match[3].length : 0),
          chunk: null,
        };
        after.chunk = jsdocComment.comment.substr(after.index);
        // get return type, if any
        let replaced = 'instanceOf(';
        if (match.length > 4 && match[4]) {
          replaced += match[4];
        } else if (match.length > 5 && match[5]) {
          replaced += match[5];
        }
        replaced += ')';
        // set the comment and scan for next match
        jsdocComment.comment = before.chunk + replaced + after.chunk;
        match = r.exec(jsdocComment.comment);
      }
    }
  },
};
