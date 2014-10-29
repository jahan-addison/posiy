var Lexer = require('./lexer');

/* Parse a regular expression into Reverse Polish Notation */

var Parser = function(pattern) {
  this._lexer  = new Lexer(pattern);
  this.pattern = pattern;
}

Parser.prototype = (function() {
  /*
   ** Private
   */
    var outputQueue   = [],
      operatorStack   = [],
      operatorOrder   = Object.freeze({
        '(': 1,
        ')': 1,
        '*': 2,
        '.': 3, // we will let '.' stand for concatenation here
        '|': 4,
       });

  /*
   ** Public
   */
   return {
    Constructor: Parser,
    parse: function() {
      /* Order of precedence: Highest to lowest - Associativity
        1) Parenthesis    - non-associative
        2) Kleene star    - left
        3) Concatenation  - left
        4) Union          - left
      */
      var token, concat = false;
      while ((token = this._lexer.getNextToken()) != 'EMPTY') {
        switch (token) {
          case 'KLEENE_STAR':
            concat = false;
            operatorStack.unshift('*');    
            break;
          case 'CHAR':
            if (concat) {
              operatorStack.unshift('.');    
            } else if (this._lexer.pointer == this.pattern.length &&
              operatorStack[0] == '*') {
              operatorStack.unshift('.');                  
            }
            concat = true;
            outputQueue.push(this._lexer.scanner);
            break;
          case 'UNION':
            concat = false;
            operatorStack.unshift('|');
        }
      }
      while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
      }
      return outputQueue;
    },
    RPN: function() {
      return this.parse().join('');
    }
   };

})();

//var test = new Parser('a*|b');
//console.log(test.RPN());

module.exports = Parser;