var Thompson = require('./thompson');

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

var regex = new Posiy('abcdefghijk');
console.log(regex.test('abcdefghijk'));
