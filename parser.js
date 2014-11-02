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
        '(': 4,
        ')': 4,
        '*': 3,
        '.': 2, // we will let '.' stand for concatenation here
        '|': 1,
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
            operatorStack.push('*');    
            break;
          case 'CHAR':
            if (concat) {
              if (operatorStack.length) {
                if (operatorOrder[operatorStack[0]] >= operatorOrder['.']) {
                  outputQueue.push(operatorStack.pop());
                }
              }
              operatorStack.push('.');    
            } else if (this._lexer.pointer == this.pattern.length &&
              operatorStack[0] == '*') {
              operatorStack.push('.');                  
            }
            concat = true;
            outputQueue.push(this._lexer.scanner);
            break;
          case 'UNION':
            concat = false;
            if (operatorStack.length) {
              if (operatorOrder[operatorStack[0]] >= operatorOrder['|']) {
                outputQueue.push(operatorStack.pop());
              }
            }
            operatorStack.push('|');
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

module.exports = Parser;