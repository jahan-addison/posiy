posiy
====
There are notably two approaches to regular expression matching. One is in widespread use in the standard interpreted languages like Ruby, Perl, PHP. The other is used in few places, for example awk and grep.

The latter is called Thompson's Construction (Thompson NFA), sometimes called McNaughton-Yamada-Thompson's algorithm. The algorithm is syntax-directed, in the sense that it works recursively up the parse tree for the regular expression. For each subexpression the algorithm constructs an NFA with a single accepting state.

Example.
---------

The Thompson NFA for the regular expression `a|b` is:

![NFA](http://hackingoff.com/images/re2nfa/2014-10-26_18-04-44_-0700-nfa.svg)

`a*`:

![NFA](http://hackingoff.com/images/re2nfa/2014-10-26_21-02-20_-0700-nfa.svg).

NFA's (non-deterministic finate automata) in terms of Regular Expressions are easier to create; however, DFA's have the special characteristic of being faster state machines.

There is a well known algorithm known as Subset Construction for converting `NFA -> DFA`.

The DFA of `a|b` from the above NFA: 

![DFA](http://hackingoff.com/images/re2nfa/2014-10-26_21-06-09_-0700-dfa.svg).

What is posiy?
---------------

Posiy is my implementation of Thompson-McNaughton-Yamada construction NFA from Regular Expressions In JavaScript. I initially planned to implement only the Union, Kleene-star,  and Concatenation operators. However this is very likely to expand and I will keep updates documented.