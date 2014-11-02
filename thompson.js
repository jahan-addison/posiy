var Parser     = require('./parser');
var fragments  = require('./fragments'),
  FragmentList = fragments.FragmentList,
  Fragment     = fragments.Fragment;

/* The McNaughton-Yamada-Thompson Algorithm */

var Thompson = function(pattern) {
  this._pattern = pattern;
  this._parser  = new Parser(pattern);
  console.log(this._parser.RPN());
};

Thompson.prototype = (function() {
  /*
   ** Private
   */
  var automaton       = [],
      stack           = [],
      state           = 1,
      temp,
      operatorOrder   = Object.freeze({
        '(': 4,
        ')': 4,
        '*': 3,
        '.': 2, 
        '|': 1,
       });

  var connect = function(frag1, frag2) {
    // connect two lists of fragments 
    if ((frag1 instanceof FragmentList)
      && (frag2 instanceof FragmentList)) {
      frag1.pop();
      frag1.append(frag2);
      return frag1;
      // append the second fragment to the first list
    } else if (frag1 instanceof FragmentList) {
      frag1.push(frag2);
      return frag1;
      // construct a fragment list for the first fragment and append the second list
    } else if (frag2 instanceof FragmentList) {
      temp = new FragmentList();
      temp.push(frag1);
      temp.append(frag2);
      return temp;
      // create a fragment list and push the fragments onto it
    } else {
      temp = new FragmentList();
      temp.append([frag1, frag2]);
      return temp;      
    }
  };

  /*
   ** Public
   */

  var transform = function() {
    var RPNArray = this._parser.parse(),
        token;
    while ((token = RPNArray.shift())) {
      switch(token) {
        
        /* Concatenation: */

        case '.':
          var e1 = stack.pop(), // second
              e2 = stack.pop(); // first
          stack.push(connect(e2, e1));
          break;

        /* Union: */

        case '|':
          var e1    = stack.pop(), // second
              e2    = stack.pop(), // first
              frag1 = new FragmentList(),
              frag2 = new FragmentList();
          // in the case the first operand is not a list
          if (!(e2 instanceof FragmentList)) {
            frag1.push(e2);
          } else {
            frag1 = e2;
          }
          // in the case the second operand is not a list
          if (!(e1 instanceof FragmentList)) {
            frag2.push(e1);
          } else {
            frag2 = e1;
          }
          // append connection node
          temp = frag1.last().get(0);
          frag1.push(new Fragment("", frag1.length() + frag2.length() + 2));
          // increment the states of the first operand
          frag1.each(function(e) {
            temp = e.get(0);
            e.updateState(0, parseInt(temp) + 1);
          });
          // increment the states of the second operand
          frag2.each(function(e) {
            temp = e.get(0);
            e.updateState(0, parseInt(temp) + 2);
          });
          // append connection node
          frag2.push(new Fragment("", frag1.length() + frag2.length() + 2));
          temp = new Fragment("");

          // put on the stack
          temp.addState(frag1.first().get()[0]-1);
          temp.addState(frag2.first().get()[0]-1);
          stack.unshift(temp);
          stack.push(frag1);
          stack.push(frag2);
          break;

        /* Symbol: (default) */

        default:
          stack.push(new Fragment(token, state++));
          break;
      }
    }
    stack.forEach(function(e, i) {
      if (e instanceof FragmentList) {
        e.flatten().forEach(function(m) {
          automaton.push(m);
        })
      } else if (e instanceof Fragment) {
        automaton.push(e.toObject());
      };
    })
    automaton.push({});
    return automaton;
  };

  return {
    Constructor: Thompson,
    transform: transform,
  };

})();

module.exports = Thompson;