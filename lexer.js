/* Rule Lexer */

var Lexer = function(pattern) {
  this.current_token;
  this.pattern  = pattern;
  this._pointer = 0;
  this._scanner;

  Object.defineProperty(this, "scanner", {
    get: function() { return this._scanner; }
  });
  Object.defineProperty(this, "pointer", {
    get: function() { return this._pointer; }
  });
};

Lexer.prototype = (function() {
  /*
   ** Private
   */

  var tokens   = Object.freeze({
    T_EMPTY:          'EMPTY',
    T_KLEENE_STAR:    'KLEENE_STAR',
    T_UNION:          'UNION',
    T_CONCAT:         'CONCAT',
    T_CHAR:           'CHAR'
  });

  var stack = [];

  var alphabet = ['abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789!@#%\'"-_+=,.'
  ].join('').split('');

  var inAlphabet = function(e) {
    return alphabet.some(function(p) {
      return p == e;
    });
  };

  /*
   ** Public
   */

   return {
    Constructor: Lexer,
    getNextRule: function() {
      switch (this.pattern[this._pointer]) {
        case '*':
          this._pointer++;
          this._scanner      = this.pattern[this._pointer-1];
          stack.push(this._scanner);
          this.current_token = tokens['T_KLEENE_STAR'];
          return tokens['T_KLEENE_STAR'];
        case '|':
          this._pointer++;
          this._scanner = undefined;
          this.current_token = tokens['T_UNION'];
          return tokens['T_UNION'];
      }
      if (inAlphabet(this.pattern[this._pointer])) {
        this._scanner = this.pattern[this._pointer];
        this._pointer++;
        this.current_token = tokens['T_CHAR'];
        return tokens['T_CHAR'];
       }
      this._scanner = undefined;
      this._pointer++;
      this.current_token = tokens['T_EMPTY'];
      return tokens['T_EMPTY'];
    }
  };
})();

module.exports = Lexer;