module.exports = function(w) {
  var // Regex segments
        A       = "['+a-z0-9]"
      , V       = "[aeiou]"
      , VY      = "[aeiouy]"
      , C       = "[bcdfghjklmnpqrstvwxz]"
      , C2      = "bb|cc|dd|ff|gg|hh|jj|kk|ll|mm|nn|pp|qq|rr|ss|tt|vv|ww|xx|zz"
      , CY      = "[bcdfghjklmnpqrstvwxyz]"
      , S2      = "ss|zz"
      , S       = "[sxz]|([cs]h)"
      , PRE     = "be|ex|in|mis|pre|pro|re"
      , EDING   = "ed|ing"
      , ESEDING = "es|ed|ing"

      // Rules
      , RULES = {
          // verbs
            "^(am|are|is|was|wast|wert|were|being|been)$"
                        : word("be")
          , "^(had|has|hast)$"
                        : word("has")
          , "^(does|did|done|didst)$"
                        : word("do")
          , "((beat|browbeat)en)|((bias|canvas)es)"
                        : stem(2,"")
          , "^(aches|aped|axed|(cadd|v)ied)$"
                        : stem(2,"e")
          , "^((cadd|v)ying)$"
                        : stem(4,"ie")

          , "^(tun|gangren|wan|grip|unit|coher|comper|rever|semaphor\
|commun|reunit|dynamit|superven|telephon|ton|aton|bon|phon\
|plan|profan|importun|enthron|elop|interlop|sellotap|sideswip\
|slop|scrap|mop|lop|expung|lung|past|premier|rang|secret)({EDING})$"
                        : semi_reg_stem(0,"e")

          , "^(unroll|unscroll|unseat|whang|wank|bath|billet|collar\
|ballot|earth|fathom|fillet|mortar|parrot|profit|ransom|slang)({EDING})$"
                        : semi_reg_stem(0,"")
          // nouns
          , "{A}*wives" : stem(3,"fe")
          , "{A}+hedra" : stem(2,"ron")
        }

  function word(w) {
    return function(word,matches) {
      return w;
    };
  }

  function stem(del,add) {
    return function(word,matches) {
      return word.slice(0,word.length-del) + add;
    };
  }

  function semi_reg_stem(del,add) {
    return function(word,matches) {
      return matches[1].slice(0,matches[1].length-del) + add;
    };
  }

  w = w.toLowerCase()

  var lemma = w

  for(rule in RULES) {
    var   r = rule,
          m = null

    r =   r
        . replace('{A}',A)
        . replace('{EDING}',EDING)

    if (m = new RegExp(r).exec(w)) {
      lemma = RULES[rule](w,m)
    }
  }

  return lemma;
}