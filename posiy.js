var Thompson = require('./thompson');
var Lexer    = require('./lexer');


var Posiy = function(pattern) {
  this._pattern      = pattern;
  this._StateMachine = require('statemachines');
};

Posiy.prototype.test = function(str) {
  var construction = new Thompson(this._pattern),
      transitions  = construction.transform();
  console.log(transitions);
  var NFA = new this._StateMachine.Nondeterministic(transitions, [transitions.length-1]);
  var DFA = NFA.subset();
  return DFA.test(str);
};

var regex = new Posiy('a|b');
console.log(regex.test('a'));
/*
regex.getNextRule();
console.log(regex);
regex.getNextRule();
console.log(regex);
regex.getNextRule();
console.log(regex);
regex.getNextRule();
console.log(regex);
*/