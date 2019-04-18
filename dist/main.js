!(function(t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define('necto', [], e)
    : 'object' == typeof exports
    ? (exports.necto = e())
    : (t.necto = e());
})(window, function() {
  return (function(t) {
    var e = {};
    function r(n) {
      if (e[n]) return e[n].exports;
      var o = (e[n] = { i: n, l: !1, exports: {} });
      return t[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    return (
      (r.m = t),
      (r.c = e),
      (r.d = function(t, e, n) {
        r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
      }),
      (r.r = function(t) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      }),
      (r.t = function(t, e) {
        if ((1 & e && (t = r(t)), 8 & e)) return t;
        if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
          2 & e && 'string' != typeof t)
        )
          for (var o in t)
            r.d(
              n,
              o,
              function(e) {
                return t[e];
              }.bind(null, o)
            );
        return n;
      }),
      (r.n = function(t) {
        var e =
          t && t.__esModule
            ? function() {
                return t.default;
              }
            : function() {
                return t;
              };
        return r.d(e, 'a', e), e;
      }),
      (r.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (r.p = '/dist/'),
      r((r.s = 3))
    );
  })([
    function(t, e, r) {
      /*! Case - v1.6.1 - 2019-01-11
       * Copyright (c) 2019 Nathan Bubna; Licensed MIT, GPL */
      (function() {
        'use strict';
        var e = function(t, e) {
            return (
              (e = e || ''),
              t.replace(/(^|-)/g, '$1\\u' + e).replace(/,/g, '\\u' + e)
            );
          },
          r = e('20-26,28-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7', '00'),
          n = 'a-z' + e('DF-F6,F8-FF', '00'),
          o = 'A-Z' + e('C0-D6,D8-DE', '00'),
          a = function(t, e, a, i) {
            return (
              (t = t || r),
              (e = e || n),
              (a = a || o),
              (i =
                i ||
                'A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via'),
              {
                capitalize: new RegExp('(^|[' + t + '])([' + e + '])', 'g'),
                pascal: new RegExp('(^|[' + t + '])+([' + e + a + '])', 'g'),
                fill: new RegExp('[' + t + ']+(.|$)', 'g'),
                sentence: new RegExp(
                  '(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")([' + e + '])',
                  'g'
                ),
                improper: new RegExp('\\b(' + i + ')\\b', 'g'),
                relax: new RegExp(
                  '([^' + a + '])([' + a + ']*)([' + a + '])(?=[^' + a + ']|$)',
                  'g'
                ),
                upper: new RegExp('^[^' + e + ']+$'),
                hole: /[^\s]\s[^\s]/,
                apostrophe: /'/g,
                room: new RegExp('[' + t + ']'),
              }
            );
          },
          i = a(),
          c = {
            re: i,
            unicodes: e,
            regexps: a,
            types: [],
            up: String.prototype.toUpperCase,
            low: String.prototype.toLowerCase,
            cap: function(t) {
              return c.up.call(t.charAt(0)) + t.slice(1);
            },
            decap: function(t) {
              return c.low.call(t.charAt(0)) + t.slice(1);
            },
            deapostrophe: function(t) {
              return t.replace(i.apostrophe, '');
            },
            fill: function(t, e, r) {
              return (
                null != e &&
                  (t = t.replace(i.fill, function(t, r) {
                    return r ? e + r : '';
                  })),
                r && (t = c.deapostrophe(t)),
                t
              );
            },
            prep: function(t, e, r, n) {
              if (
                ((t = null == t ? '' : t + ''),
                !n && i.upper.test(t) && (t = c.low.call(t)),
                !e && !i.hole.test(t))
              ) {
                var o = c.fill(t, ' ');
                i.hole.test(o) && (t = o);
              }
              return (
                r || i.room.test(t) || (t = t.replace(i.relax, c.relax)), t
              );
            },
            relax: function(t, e, r, n) {
              return e + ' ' + (r ? r + ' ' : '') + n;
            },
          },
          u = {
            _: c,
            of: function(t) {
              for (var e = 0, r = c.types.length; e < r; e++)
                if (u[c.types[e]].apply(u, arguments) === t) return c.types[e];
            },
            flip: function(t) {
              return t.replace(/\w/g, function(t) {
                return (t == c.up.call(t) ? c.low : c.up).call(t);
              });
            },
            random: function(t) {
              return t.replace(/\w/g, function(t) {
                return (Math.round(Math.random()) ? c.up : c.low).call(t);
              });
            },
            type: function(t, e) {
              (u[t] = e), c.types.push(t);
            },
          },
          f = {
            lower: function(t, e, r) {
              return c.fill(c.low.call(c.prep(t, e)), e, r);
            },
            snake: function(t) {
              return u.lower(t, '_', !0);
            },
            constant: function(t) {
              return u.upper(t, '_', !0);
            },
            camel: function(t) {
              return c.decap(u.pascal(t));
            },
            kebab: function(t) {
              return u.lower(t, '-', !0);
            },
            upper: function(t, e, r) {
              return c.fill(c.up.call(c.prep(t, e, !1, !0)), e, r);
            },
            capital: function(t, e, r) {
              return c.fill(
                c.prep(t).replace(i.capitalize, function(t, e, r) {
                  return e + c.up.call(r);
                }),
                e,
                r
              );
            },
            header: function(t) {
              return u.capital(t, '-', !0);
            },
            pascal: function(t) {
              return c.fill(
                c.prep(t, !1, !0).replace(i.pascal, function(t, e, r) {
                  return c.up.call(r);
                }),
                '',
                !0
              );
            },
            title: function(t) {
              return u.capital(t).replace(i.improper, function(t, e, r, n) {
                return r > 0 && r < n.lastIndexOf(' ') ? c.low.call(t) : t;
              });
            },
            sentence: function(t, e, r) {
              return (
                (t = u.lower(t).replace(i.sentence, function(t, e, r) {
                  return e + c.up.call(r);
                })),
                e &&
                  e.forEach(function(e) {
                    t = t.replace(
                      new RegExp('\\b' + u.lower(e) + '\\b', 'g'),
                      c.cap
                    );
                  }),
                r &&
                  r.forEach(function(e) {
                    t = t.replace(
                      new RegExp('(\\b' + u.lower(e) + '\\. +)(\\w)'),
                      function(t, e, r) {
                        return e + c.low.call(r);
                      }
                    );
                  }),
                t
              );
            },
          };
        for (var l in ((f.squish = f.pascal), f)) u.type(l, f[l]);
        var s = 'function' == typeof s ? s : function() {};
        s(t.exports ? (t.exports = u) : (this.Case = u));
      }.call(this));
    },
    function(t, e, r) {
      var n = (function(t) {
        'use strict';
        var e,
          r = Object.prototype,
          n = r.hasOwnProperty,
          o = 'function' == typeof Symbol ? Symbol : {},
          a = o.iterator || '@@iterator',
          i = o.asyncIterator || '@@asyncIterator',
          c = o.toStringTag || '@@toStringTag';
        function u(t, e, r, n) {
          var o = e && e.prototype instanceof d ? e : d,
            a = Object.create(o.prototype),
            i = new P(n || []);
          return (
            (a._invoke = (function(t, e, r) {
              var n = l;
              return function(o, a) {
                if (n === p) throw new Error('Generator is already running');
                if (n === y) {
                  if ('throw' === o) throw a;
                  return _();
                }
                for (r.method = o, r.arg = a; ; ) {
                  var i = r.delegate;
                  if (i) {
                    var c = E(i, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ('next' === r.method) r.sent = r._sent = r.arg;
                  else if ('throw' === r.method) {
                    if (n === l) throw ((n = y), r.arg);
                    r.dispatchException(r.arg);
                  } else 'return' === r.method && r.abrupt('return', r.arg);
                  n = p;
                  var u = f(t, e, r);
                  if ('normal' === u.type) {
                    if (((n = r.done ? y : s), u.arg === h)) continue;
                    return { value: u.arg, done: r.done };
                  }
                  'throw' === u.type &&
                    ((n = y), (r.method = 'throw'), (r.arg = u.arg));
                }
              };
            })(t, r, i)),
            a
          );
        }
        function f(t, e, r) {
          try {
            return { type: 'normal', arg: t.call(e, r) };
          } catch (t) {
            return { type: 'throw', arg: t };
          }
        }
        t.wrap = u;
        var l = 'suspendedStart',
          s = 'suspendedYield',
          p = 'executing',
          y = 'completed',
          h = {};
        function d() {}
        function g() {}
        function v() {}
        var m = {};
        m[a] = function() {
          return this;
        };
        var w = Object.getPrototypeOf,
          b = w && w(w(L([])));
        b && b !== r && n.call(b, a) && (m = b);
        var O = (v.prototype = d.prototype = Object.create(m));
        function S(t) {
          ['next', 'throw', 'return'].forEach(function(e) {
            t[e] = function(t) {
              return this._invoke(e, t);
            };
          });
        }
        function x(t) {
          var e;
          this._invoke = function(r, o) {
            function a() {
              return new Promise(function(e, a) {
                !(function e(r, o, a, i) {
                  var c = f(t[r], t, o);
                  if ('throw' !== c.type) {
                    var u = c.arg,
                      l = u.value;
                    return l && 'object' == typeof l && n.call(l, '__await')
                      ? Promise.resolve(l.__await).then(
                          function(t) {
                            e('next', t, a, i);
                          },
                          function(t) {
                            e('throw', t, a, i);
                          }
                        )
                      : Promise.resolve(l).then(
                          function(t) {
                            (u.value = t), a(u);
                          },
                          function(t) {
                            return e('throw', t, a, i);
                          }
                        );
                  }
                  i(c.arg);
                })(r, o, e, a);
              });
            }
            return (e = e ? e.then(a, a) : a());
          };
        }
        function E(t, r) {
          var n = t.iterator[r.method];
          if (n === e) {
            if (((r.delegate = null), 'throw' === r.method)) {
              if (
                t.iterator.return &&
                ((r.method = 'return'),
                (r.arg = e),
                E(t, r),
                'throw' === r.method)
              )
                return h;
              (r.method = 'throw'),
                (r.arg = new TypeError(
                  "The iterator does not provide a 'throw' method"
                ));
            }
            return h;
          }
          var o = f(n, t.iterator, r.arg);
          if ('throw' === o.type)
            return (
              (r.method = 'throw'), (r.arg = o.arg), (r.delegate = null), h
            );
          var a = o.arg;
          return a
            ? a.done
              ? ((r[t.resultName] = a.value),
                (r.next = t.nextLoc),
                'return' !== r.method && ((r.method = 'next'), (r.arg = e)),
                (r.delegate = null),
                h)
              : a
            : ((r.method = 'throw'),
              (r.arg = new TypeError('iterator result is not an object')),
              (r.delegate = null),
              h);
        }
        function j(t) {
          var e = { tryLoc: t[0] };
          1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e);
        }
        function A(t) {
          var e = t.completion || {};
          (e.type = 'normal'), delete e.arg, (t.completion = e);
        }
        function P(t) {
          (this.tryEntries = [{ tryLoc: 'root' }]),
            t.forEach(j, this),
            this.reset(!0);
        }
        function L(t) {
          if (t) {
            var r = t[a];
            if (r) return r.call(t);
            if ('function' == typeof t.next) return t;
            if (!isNaN(t.length)) {
              var o = -1,
                i = function r() {
                  for (; ++o < t.length; )
                    if (n.call(t, o)) return (r.value = t[o]), (r.done = !1), r;
                  return (r.value = e), (r.done = !0), r;
                };
              return (i.next = i);
            }
          }
          return { next: _ };
        }
        function _() {
          return { value: e, done: !0 };
        }
        return (
          (g.prototype = O.constructor = v),
          (v.constructor = g),
          (v[c] = g.displayName = 'GeneratorFunction'),
          (t.isGeneratorFunction = function(t) {
            var e = 'function' == typeof t && t.constructor;
            return (
              !!e &&
              (e === g || 'GeneratorFunction' === (e.displayName || e.name))
            );
          }),
          (t.mark = function(t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, v)
                : ((t.__proto__ = v), c in t || (t[c] = 'GeneratorFunction')),
              (t.prototype = Object.create(O)),
              t
            );
          }),
          (t.awrap = function(t) {
            return { __await: t };
          }),
          S(x.prototype),
          (x.prototype[i] = function() {
            return this;
          }),
          (t.AsyncIterator = x),
          (t.async = function(e, r, n, o) {
            var a = new x(u(e, r, n, o));
            return t.isGeneratorFunction(r)
              ? a
              : a.next().then(function(t) {
                  return t.done ? t.value : a.next();
                });
          }),
          S(O),
          (O[c] = 'Generator'),
          (O[a] = function() {
            return this;
          }),
          (O.toString = function() {
            return '[object Generator]';
          }),
          (t.keys = function(t) {
            var e = [];
            for (var r in t) e.push(r);
            return (
              e.reverse(),
              function r() {
                for (; e.length; ) {
                  var n = e.pop();
                  if (n in t) return (r.value = n), (r.done = !1), r;
                }
                return (r.done = !0), r;
              }
            );
          }),
          (t.values = L),
          (P.prototype = {
            constructor: P,
            reset: function(t) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = e),
                (this.done = !1),
                (this.delegate = null),
                (this.method = 'next'),
                (this.arg = e),
                this.tryEntries.forEach(A),
                !t)
              )
                for (var r in this)
                  't' === r.charAt(0) &&
                    n.call(this, r) &&
                    !isNaN(+r.slice(1)) &&
                    (this[r] = e);
            },
            stop: function() {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ('throw' === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function(t) {
              if (this.done) throw t;
              var r = this;
              function o(n, o) {
                return (
                  (c.type = 'throw'),
                  (c.arg = t),
                  (r.next = n),
                  o && ((r.method = 'next'), (r.arg = e)),
                  !!o
                );
              }
              for (var a = this.tryEntries.length - 1; a >= 0; --a) {
                var i = this.tryEntries[a],
                  c = i.completion;
                if ('root' === i.tryLoc) return o('end');
                if (i.tryLoc <= this.prev) {
                  var u = n.call(i, 'catchLoc'),
                    f = n.call(i, 'finallyLoc');
                  if (u && f) {
                    if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                    if (this.prev < i.finallyLoc) return o(i.finallyLoc);
                  } else if (u) {
                    if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                  } else {
                    if (!f)
                      throw new Error('try statement without catch or finally');
                    if (this.prev < i.finallyLoc) return o(i.finallyLoc);
                  }
                }
              }
            },
            abrupt: function(t, e) {
              for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                var o = this.tryEntries[r];
                if (
                  o.tryLoc <= this.prev &&
                  n.call(o, 'finallyLoc') &&
                  this.prev < o.finallyLoc
                ) {
                  var a = o;
                  break;
                }
              }
              a &&
                ('break' === t || 'continue' === t) &&
                a.tryLoc <= e &&
                e <= a.finallyLoc &&
                (a = null);
              var i = a ? a.completion : {};
              return (
                (i.type = t),
                (i.arg = e),
                a
                  ? ((this.method = 'next'), (this.next = a.finallyLoc), h)
                  : this.complete(i)
              );
            },
            complete: function(t, e) {
              if ('throw' === t.type) throw t.arg;
              return (
                'break' === t.type || 'continue' === t.type
                  ? (this.next = t.arg)
                  : 'return' === t.type
                  ? ((this.rval = this.arg = t.arg),
                    (this.method = 'return'),
                    (this.next = 'end'))
                  : 'normal' === t.type && e && (this.next = e),
                h
              );
            },
            finish: function(t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var r = this.tryEntries[e];
                if (r.finallyLoc === t)
                  return this.complete(r.completion, r.afterLoc), A(r), h;
              }
            },
            catch: function(t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var r = this.tryEntries[e];
                if (r.tryLoc === t) {
                  var n = r.completion;
                  if ('throw' === n.type) {
                    var o = n.arg;
                    A(r);
                  }
                  return o;
                }
              }
              throw new Error('illegal catch attempt');
            },
            delegateYield: function(t, r, n) {
              return (
                (this.delegate = { iterator: L(t), resultName: r, nextLoc: n }),
                'next' === this.method && (this.arg = e),
                h
              );
            },
          }),
          t
        );
      })(t.exports);
      try {
        regeneratorRuntime = n;
      } catch (t) {
        Function('r', 'regeneratorRuntime = r')(n);
      }
    },
    function(t, e, r) {
      t.exports = (function() {
        'use strict';
        var t = function(t) {
            return (
              (function(t) {
                return !!t && 'object' == typeof t;
              })(t) &&
              !(function(t) {
                var r = Object.prototype.toString.call(t);
                return (
                  '[object RegExp]' === r ||
                  '[object Date]' === r ||
                  (function(t) {
                    return t.$$typeof === e;
                  })(t)
                );
              })(t)
            );
          },
          e =
            'function' == typeof Symbol && Symbol.for
              ? Symbol.for('react.element')
              : 60103;
        function r(t, e) {
          return !1 !== e.clone && e.isMergeableObject(t)
            ? a(((r = t), Array.isArray(r) ? [] : {}), t, e)
            : t;
          var r;
        }
        function n(t, e, n) {
          return t.concat(e).map(function(t) {
            return r(t, n);
          });
        }
        function o(t, e, n) {
          var o = {};
          return (
            n.isMergeableObject(t) &&
              Object.keys(t).forEach(function(e) {
                o[e] = r(t[e], n);
              }),
            Object.keys(e).forEach(function(i) {
              n.isMergeableObject(e[i]) && t[i]
                ? (o[i] = (function(t, e) {
                    if (!e.customMerge) return a;
                    var r = e.customMerge(t);
                    return 'function' == typeof r ? r : a;
                  })(i, n)(t[i], e[i], n))
                : (o[i] = r(e[i], n));
            }),
            o
          );
        }
        function a(e, a, i) {
          ((i = i || {}).arrayMerge = i.arrayMerge || n),
            (i.isMergeableObject = i.isMergeableObject || t);
          var c = Array.isArray(a),
            u = Array.isArray(e),
            f = c === u;
          return f ? (c ? i.arrayMerge(e, a, i) : o(e, a, i)) : r(a, i);
        }
        return (
          (a.all = function(t, e) {
            if (!Array.isArray(t))
              throw new Error('first argument should be an array');
            return t.reduce(function(t, r) {
              return a(t, r, e);
            }, {});
          }),
          a
        );
      })();
    },
    function(t, e, r) {
      'use strict';
      r.r(e);
      var n = function(t) {
          return (
            (t && '[object Function]' === {}.toString.call(t)) ||
            '[object GeneratorFunction]' === {}.toString.call(t)
          );
        },
        o = function(t) {
          return t && '[object GeneratorFunction]' === {}.toString.call(t);
        },
        a = function(t, e, r) {
          e = (function(t) {
            if ('string' != typeof t) return t;
            var e = [];
            return (
              t.split('.').forEach(function(t, r) {
                t.split(/\[([^}]+)\]/g).forEach(function(t) {
                  t.length > 0 && e.push(t);
                });
              }),
              e
            );
          })(e);
          for (var n = t, o = 0; o < e.length; o++) {
            if (!n[e[o]]) return r;
            n = n[e[o]];
          }
          return n;
        },
        i = function(t) {
          return (
            [Object, Array].includes((t || {}).constructor) &&
            !(function(t) {
              for (
                var e = Object.keys(t), r = e.length, n = new Array(r);
                r--;

              )
                n[r] = [e[r], t[e[r]]];
              return n;
            })(t || {}).length
          );
        },
        c = function(t, e) {
          throw new Error(
            'Missing paramter "'.concat(t, '" in ').concat(e, '.')
          );
        },
        u = function(t, e, r) {
          var n = a(t, e);
          0 === n ||
            !1 === n ||
            n ||
            (function(t, e, r) {
              var n = t.type || r,
                o = ''
                  .concat(n, ' expected to contain the parameter "')
                  .concat(e, '" but received the action (')
                  .concat(JSON.stringify(t), ') instead.');
              throw new Error(o);
            })(t, e, r);
        },
        f = function(t) {
          var e = t.requiredParams,
            r = t.actionResult,
            n = t.actionName;
          Array.isArray(e) &&
            e.length &&
            e.forEach(function(t) {
              try {
                u(r, t, n);
              } catch (t) {
                console.error(t);
              }
            });
        },
        l = function(t) {
          var e = t.actionName,
            r = void 0 === e ? c('actionName', 'ensureRequiredParams') : e,
            o = t.actionResult,
            a = void 0 === o ? c('actionResult', 'ensureRequiredParams') : o,
            u = t.requiredParams,
            l = void 0 === u ? null : u,
            s = t.shouldSilenceErrors,
            p = void 0 !== s && s;
          if (n(p) && p()) return a;
          if (i(l)) return a;
          if (Array.isArray(l))
            f({ requiredParams: l, actionResult: a, actionName: r });
          else {
            var y = l.payload,
              h = l.meta;
            if (y && n(y.map)) {
              var d = y.map(function(t) {
                return 'payload.'.concat(t);
              });
              f({ requiredParams: d, actionResult: a, actionName: r });
            }
            if (h && n(h.map)) {
              var g = h.map(function(t) {
                return 'meta.'.concat(t);
              });
              f({ requiredParams: g, actionResult: a, actionName: r });
            }
          }
          return a;
        };
      function s(t) {
        return n(t)
          ? t
              .toString()
              .match(/\s.*?\(([^)]*)\)/)[1]
              .split(',')
              .map(function(t) {
                return t.replace(/\/\*.*\*\//, '').trim();
              })
              .filter(function(t) {
                return t;
              })
          : [];
      }
      var p = r(1),
        y = r.n(p),
        h = function(t) {
          return '@@redux-saga/' + t;
        },
        d = h('IO'),
        g = h('MULTICAST'),
        v = h('SELF_CANCELLATION');
      var m = function(t) {
          return null != t;
        },
        w = function(t) {
          return 'function' == typeof t;
        },
        b = function(t) {
          return 'string' == typeof t;
        },
        O = Array.isArray,
        S = function t(e) {
          return e && (b(e) || j(e) || w(e) || (O(e) && e.every(t)));
        },
        x = function(t) {
          return t && w(t.take) && w(t.close);
        },
        E = function(t) {
          return w(t) && t.hasOwnProperty('toString');
        },
        j = function(t) {
          return (
            Boolean(t) &&
            'function' == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
          );
        },
        A = function(t) {
          return x(t) && t[g];
        };
      'function' == typeof Symbol &&
        Symbol.asyncIterator &&
        Symbol.asyncIterator;
      var P = function(t) {
          throw t;
        },
        L = function(t) {
          return { value: t, done: !0 };
        };
      var _ = 'TAKE',
        R = 'FORK',
        k = 'CANCEL',
        F = function(t, e) {
          var r;
          return (
            ((r = {})[d] = !0),
            (r.combinator = !1),
            (r.type = t),
            (r.payload = e),
            r
          );
        };
      function N(t, e) {
        return (
          void 0 === t && (t = '*'),
          S(t)
            ? F(_, { pattern: t })
            : A(t) && m(e) && S(e)
            ? F(_, { channel: t, pattern: e })
            : x(t)
            ? F(_, { channel: t })
            : void 0
        );
      }
      function I(t, e) {
        var r,
          n = null;
        return (
          w(t)
            ? (r = t)
            : (O(t) ? ((n = t[0]), (r = t[1])) : ((n = t.context), (r = t.fn)),
              n && b(r) && w(n[r]) && (r = n[r])),
          { context: n, fn: r, args: e }
        );
      }
      function q(t) {
        for (
          var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), n = 1;
          n < e;
          n++
        )
          r[n - 1] = arguments[n];
        return F(R, I(t, r));
      }
      var C = function(t) {
          return { done: !0, value: t };
        },
        T = {};
      function M(t) {
        return x(t) ? 'channel' : E(t) ? String(t) : w(t) ? t.name : String(t);
      }
      function D(t, e, r) {
        var n,
          o,
          a,
          i = e;
        function c(e, r) {
          if (i === T) return C(e);
          if (r && !o) throw ((i = T), r);
          n && n(e);
          var c = r ? t[o](r) : t[i]();
          return (
            (i = c.nextState),
            (a = c.effect),
            (n = c.stateUpdater),
            (o = c.errorState),
            i === T ? C(e) : a
          );
        }
        return (function(t, e, r) {
          void 0 === e && (e = P), void 0 === r && (r = 'iterator');
          var n = {
            meta: { name: r },
            next: t,
            throw: e,
            return: L,
            isSagaIterator: !0,
          };
          return (
            'undefined' != typeof Symbol &&
              (n[Symbol.iterator] = function() {
                return n;
              }),
            n
          );
        })(
          c,
          function(t) {
            return c(null, t);
          },
          r
        );
      }
      function G(t, e) {
        for (
          var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2;
          o < r;
          o++
        )
          n[o - 2] = arguments[o];
        var a,
          i = { done: !1, value: N(t) },
          c = function(t) {
            return (a = t);
          };
        return D(
          {
            q1: function() {
              return { nextState: 'q2', effect: i, stateUpdater: c };
            },
            q2: function() {
              return {
                nextState: 'q1',
                effect: ((t = a),
                { done: !1, value: q.apply(void 0, [e].concat(n, [t])) }),
              };
              var t;
            },
          },
          'q1',
          'takeEvery(' + M(t) + ', ' + e.name + ')'
        );
      }
      function B(t, e) {
        for (
          var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2;
          o < r;
          o++
        )
          n[o - 2] = arguments[o];
        var a,
          i,
          c = { done: !1, value: N(t) },
          u = function(t) {
            return { done: !1, value: q.apply(void 0, [e].concat(n, [t])) };
          },
          f = function(t) {
            return {
              done: !1,
              value: ((e = t), void 0 === e && (e = v), F(k, e)),
            };
            var e;
          },
          l = function(t) {
            return (a = t);
          },
          s = function(t) {
            return (i = t);
          };
        return D(
          {
            q1: function() {
              return { nextState: 'q2', effect: c, stateUpdater: s };
            },
            q2: function() {
              return a
                ? { nextState: 'q3', effect: f(a) }
                : { nextState: 'q1', effect: u(i), stateUpdater: l };
            },
            q3: function() {
              return { nextState: 'q1', effect: u(i), stateUpdater: l };
            },
          },
          'q1',
          'takeLatest(' + M(t) + ', ' + e.name + ')'
        );
      }
      function U(t, e) {
        for (
          var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2;
          o < r;
          o++
        )
          n[o - 2] = arguments[o];
        return q.apply(void 0, [G, t, e].concat(n));
      }
      function J(t, e) {
        for (
          var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2;
          o < r;
          o++
        )
          n[o - 2] = arguments[o];
        return q.apply(void 0, [B, t, e].concat(n));
      }
      var $ = { yield: 'takeEvery', watch: void 0 };
      var K = function() {
          var t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : c('constant', 'createSaga'),
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : c('fn', 'createSaga'),
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : $;
          if ('string' != typeof t)
            throw new Error(
              'The argument ('.concat(
                t,
                ') passed into createSaga is not a valid parameter. Constant must be a String.'
              )
            );
          if (!o(e))
            throw new Error(
              'The argument ('.concat(
                e,
                ') passed into createSaga is not a valid parameter. Fn must be valid generator function.'
              )
            );
          var a,
            i = Object.assign({}, $, r);
          if (i.watch && n(i.watch)) a = i.watch;
          else {
            var u = 'takeEvery' === i.yield ? U : J;
            a = y.a.mark(function r() {
              return y.a.wrap(function(r) {
                for (;;)
                  switch ((r.prev = r.next)) {
                    case 0:
                      return (r.next = 2), u(t, e);
                    case 2:
                    case 'end':
                      return r.stop();
                  }
              }, r);
            });
          }
          return { fn: e, watch: a, constant: t };
        },
        z = r(0),
        V = r.n(z),
        Y = function(t, e) {
          var r,
            n,
            o =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
          if ((n = t) && ('string' == typeof n || n instanceof String))
            return (function(t, e, r) {
              var n = V.a.camel(t),
                o = V.a.constant(t);
              return (
                r && r.async && (o = '[SAGA]/'.concat(o)),
                {
                  actionName: n,
                  actionType: ''.concat(e, '/').concat(o),
                  constantKey: o,
                }
              );
            })(t, e, o);
          if (
            (r = t) &&
            r.hasOwnProperty &&
            r.hasOwnProperty('name') &&
            r.hasOwnProperty('type')
          )
            return (function(t, e, r) {
              var n = t.name,
                o = t.type;
              t.merge;
              return (
                t.merge && (o = ''.concat(e, '/').concat(o)),
                { actionName: n, actionType: o, constantKey: o }
              );
            })(t, e);
          throw new Error(
            'Invalid param used in '
              .concat(
                e,
                '.createFlow - Expected String or {name, type} but received '
              )
              .concat(t, ' instead.')
          );
        };
      function Z(t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = null != arguments[e] ? arguments[e] : {},
            n = Object.keys(r);
          'function' == typeof Object.getOwnPropertySymbols &&
            (n = n.concat(
              Object.getOwnPropertySymbols(r).filter(function(t) {
                return Object.getOwnPropertyDescriptor(r, t).enumerable;
              })
            )),
            n.forEach(function(e) {
              H(t, e, r[e]);
            });
        }
        return t;
      }
      function H(t, e, r) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = r),
          t
        );
      }
      var Q = { requiredParams: [] },
        W = function(t) {
          var e = t.toUpperCase();
          return function(t) {
            var r,
              o,
              a =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : void 0,
              i =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : Q,
              u = Object.assign({}, Q, i),
              f = Y(t, e, u),
              p = f.actionName,
              y = f.constantKey,
              h = f.actionType,
              d = a && n(a),
              g = s(a),
              v = JSON.stringify(g) === JSON.stringify(['state', 'action']),
              m = JSON.stringify(g) === JSON.stringify(['action']);
            if (d)
              if (v) r = a;
              else {
                if (!m)
                  throw new Error(
                    'Could not create a valid flow path for '
                      .concat(
                        h,
                        '. \n         Expected either (state, action) for a reducer or (action) for a saga, received '
                      )
                      .concat(g, ' instead.')
                  );
                o = K(h, a, i);
              }
            var w = function() {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : c('interaction', h),
                r =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : null;
              if ('string' != typeof e)
                throw new Error(
                  'Actions must contain an interaction description string as the first parameter.\n          Expected a String, received '.concat(
                    e,
                    ' instead.'
                  )
                );
              var o = { payload: r };
              return (
                r instanceof Error && (o.error = !0),
                l({
                  actionName: t,
                  requiredParams: u.requiredParams,
                  actionResult: Z({}, o, {
                    meta: n,
                    type: '['.concat(h, '] ').concat(e),
                    _actionType: h,
                    _interaction: e,
                    _requiredParams: u.requiredParams,
                    _async: !(!d || !m),
                  }),
                })
              );
            };
            return {
              actionName: p,
              actionType: h,
              saga: o,
              action: w,
              reducer: r,
              _internal: {
                Constant: H({}, y, h),
                Action: H({}, p, w),
                Reducer: r && H({}, h, r),
                Saga: o && H({}, h, o),
              },
            };
          };
        },
        X = r(2),
        tt = r.n(X);
      function et(t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = null != arguments[e] ? arguments[e] : {},
            n = Object.keys(r);
          'function' == typeof Object.getOwnPropertySymbols &&
            (n = n.concat(
              Object.getOwnPropertySymbols(r).filter(function(t) {
                return Object.getOwnPropertyDescriptor(r, t).enumerable;
              })
            )),
            n.forEach(function(e) {
              rt(t, e, r[e]);
            });
        }
        return t;
      }
      function rt(t, e, r) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = r),
          t
        );
      }
      var nt = function(t, e) {
          return [
            t('isLoading', function(t, e) {
              return void 0 !== e.id
                ? et({}, t, {
                    isLoadingById: et({}, t.isLoadingById, rt({}, e.id, !0)),
                  })
                : et({}, t, { isLoading: !0 });
            }),
            t('isLoadingComplete', function(t, e) {
              return void 0 !== e.id
                ? et({}, t, {
                    isLoadingById: et({}, t.isLoadingById, rt({}, e.id, !1)),
                  })
                : et({}, t, { isLoading: !1 });
            }),
            t(
              { name: 'mergeDataFromApi', type: 'MERGE_DATA_FROM_API' },
              function(t, r) {
                return r.payload[e.name]
                  ? r.options &&
                    Array.isArray(r.options.include) &&
                    -1 === r.options.include.indexOf(key)
                    ? t
                    : et({}, t, {
                        byId: tt()(t.byId, r.payload[key], mergeOptions),
                      })
                  : t;
              },
              { requiredParams: ['payload'] }
            ),
          ];
        },
        ot = function() {
          return {
            initialState: {},
            reducerOptions: { deepmergeOptions: null },
          };
        };
      function at(t, e, r) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = r),
          t
        );
      }
      var it = function() {
        return (function(t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = null != arguments[e] ? arguments[e] : {},
              n = Object.keys(r);
            'function' == typeof Object.getOwnPropertySymbols &&
              (n = n.concat(
                Object.getOwnPropertySymbols(r).filter(function(t) {
                  return Object.getOwnPropertyDescriptor(r, t).enumerable;
                })
              )),
              n.forEach(function(e) {
                at(t, e, r[e]);
              });
          }
          return t;
        })(
          { isLoading: !1, isLoadingById: {}, byId: {} },
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        );
      };
      function ct(t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = null != arguments[e] ? arguments[e] : {},
            n = Object.keys(r);
          'function' == typeof Object.getOwnPropertySymbols &&
            (n = n.concat(
              Object.getOwnPropertySymbols(r).filter(function(t) {
                return Object.getOwnPropertyDescriptor(r, t).enumerable;
              })
            )),
            n.forEach(function(e) {
              ut(t, e, r[e]);
            });
        }
        return t;
      }
      function ut(t, e, r) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = r),
          t
        );
      }
      function ft(t, e) {
        if (null == t) return {};
        var r,
          n,
          o = (function(t, e) {
            if (null == t) return {};
            var r,
              n,
              o = {},
              a = Object.keys(t);
            for (n = 0; n < a.length; n++)
              (r = a[n]), e.indexOf(r) >= 0 || (o[r] = t[r]);
            return o;
          })(t, e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(t);
          for (n = 0; n < a.length; n++)
            (r = a[n]),
              e.indexOf(r) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(t, r) &&
                  (o[r] = t[r]));
        }
        return o;
      }
      function lt(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            'value' in n && (n.writable = !0),
            Object.defineProperty(t, n.key, n);
        }
      }
      var st = (function() {
        function t(e, r) {
          var n = this;
          !(function(t, e) {
            if (!(t instanceof e))
              throw new TypeError('Cannot call a class as a function');
          })(this, t),
            (this.name = e),
            (this.nameConstant = this.formatNameConstant(e)),
            (this.options = Object.assign(ot(), r)),
            (this.InitialState = this.getInitialState(
              this.options.initialState
            )),
            (this.Constants = {}),
            (this.Actions = {}),
            (this.Reducers = {}),
            (this.Sagas = {});
          var o = this.getInitialFlows(W(this.name));
          Array.isArray(o) &&
            o.forEach(function(t) {
              var e = t._internal;
              n._attachFlow(e);
            });
        }
        var e, r, o;
        return (
          (e = t),
          (r = [
            {
              key: 'createFlow',
              value: function() {
                for (
                  var t = W(this.name),
                    e = arguments.length,
                    r = new Array(e),
                    n = 0;
                  n < e;
                  n++
                )
                  r[n] = arguments[n];
                var o = t.apply(this, r),
                  a = o._internal,
                  i = ft(o, ['_internal']);
                return this._attachFlow(a), i;
              },
            },
            {
              key: 'addSaga',
              value: function() {
                for (
                  var t = arguments.length, e = new Array(t), r = 0;
                  r < t;
                  r++
                )
                  e[r] = arguments[r];
                var n = K.apply(this, e);
                return (
                  this._attachFlow({ Saga: ut({}, n.constant, n.watch) }), n
                );
              },
            },
            {
              key: 'addReducer',
              value: function(t, e) {
                var r = s(e);
                if ('string' != typeof t)
                  throw new Error(
                    'addReducer expected constant to be a string, instead got '.concat(
                      t
                    )
                  );
                if (!n(e))
                  throw new Error(
                    'addReducer expected a function, instead got '.concat(e)
                  );
                if (JSON.stringify(r) !== JSON.stringify(['state', 'action']))
                  throw new Error(
                    'addReducer expected the reducer function to have two arguments (state, action), instead got '.concat(
                      r
                    )
                  );
                this._attachFlow({ Reducer: ut({}, t, e) });
              },
            },
            {
              key: 'getSagas',
              value: function() {
                var t = this,
                  e = [];
                return (
                  Object.keys(this.Sagas).forEach(function(r) {
                    var n = t.Sagas[r].watch;
                    e.push(fork(n));
                  }),
                  all(e)
                );
              },
            },
            {
              key: 'getReducers',
              value: function() {
                return createReducer(this.InitialState, this.Reducers);
              },
            },
            {
              key: 'formatNameConstant',
              value: function(t) {
                return V.a.constant(t);
              },
            },
            {
              key: 'getInitialState',
              value: function(t) {
                return it(t);
              },
            },
            {
              key: 'getInitialFlows',
              value: function(t) {
                return nt(t, this);
              },
            },
            {
              key: '_attachFlow',
              value: function(t) {
                t.Constant &&
                  (this.Constants = ct({}, this.Constants, t.Constant)),
                  t.Action && (this.Actions = ct({}, this.Actions, t.Action)),
                  t.Reducer &&
                    (this.Reducers = ct({}, this.Reducers, t.Reducer)),
                  t.Saga && (this.Sagas = ct({}, this.Sagas, t.Saga));
              },
            },
          ]) && lt(e.prototype, r),
          o && lt(e, o),
          t
        );
      })();
      r.d(e, 'createFlow', function() {
        return W;
      }),
        r.d(e, 'getInitialFlows', function() {
          return nt;
        }),
        r.d(e, 'ensureRequiredParams', function() {
          return l;
        });
      e.default = st;
    },
  ]);
});
