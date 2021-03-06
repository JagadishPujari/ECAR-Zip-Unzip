function X2JS(t) {
    "use strict";

    function e() {
        void 0 === t.escapeMode && (t.escapeMode = !0), t.attributePrefix = t.attributePrefix || "_", "none" === t.attributePrefix && (t.attributePrefix = ""), t.arrayAccessForm = t.arrayAccessForm || "none", t.emptyNodeForm = t.emptyNodeForm || "text", void 0 === t.enableToStringFunc && (t.enableToStringFunc = !0), t.arrayAccessFormPaths = t.arrayAccessFormPaths || [], void 0 === t.skipEmptyTextNodesForObj && (t.skipEmptyTextNodesForObj = !0), void 0 === t.stripWhitespaces && (t.stripWhitespaces = !0), t.datetimeAccessFormPaths = t.datetimeAccessFormPaths || [], void 0 === t.coerce && (t.coerce = !0)
    }

    function r() {
        function t(t) {
            var e = String(t);
            return 1 === e.length && (e = "0" + e), e
        }
        "function" != typeof String.prototype.trim && (String.prototype.trim = function () {
            return this.replace(/^\s+|^\n+|(\s|\n)+$/g, "")
        }), "function" != typeof Date.prototype.toISOString && (Date.prototype.toISOString = function () {
            return this.getUTCFullYear() + "-" + t(this.getUTCMonth() + 1) + "-" + t(this.getUTCDate()) + "T" + t(this.getUTCHours()) + ":" + t(this.getUTCMinutes()) + ":" + t(this.getUTCSeconds()) + "." + String((this.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5) + "Z"
        })
    }

    function n(t) {
        var e = t.localName;
        return null == e && (e = t.baseName), (null == e || "" == e) && (e = t.nodeName), e
    }

    function i(t) {
        return t.prefix
    }

    function a(t) {
        return "string" == typeof t ? t.replace(/&/g, "&").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;") : t
    }

    function s(t) {
        return t.toString().replace(/&/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/")
    }

    function o(e, r, n) {
        switch (t.arrayAccessForm) {
            case "property":
                e[r + "_asArray"] = e[r] instanceof Array ? e[r] : [e[r]]
        }
        if (!(e[r] instanceof Array) && t.arrayAccessFormPaths.length > 0) {
            for (var i = 0; i < t.arrayAccessFormPaths.length; i++) {
                var a = t.arrayAccessFormPaths[i];
                if ("string" == typeof a) {
                    if (a == n) break
                } else if (a instanceof RegExp) {
                    if (a.test(n)) break
                } else if ("function" == typeof a && a(e, r, n)) break
            }
            i != t.arrayAccessFormPaths.length && (e[r] = [e[r]])
        }
    }

    function c(t) {
        var e = t.split(/[-T:+Z]/g),
            r = new Date(e[0], e[1] - 1, e[2]),
            n = e[5].split(".");
        if (r.setHours(e[3], e[4], n[0]), n.length > 1 && r.setMilliseconds(n[1]), e[6] && e[7]) {
            var i = 60 * e[6] + Number(e[7]),
                a = /\d\d-\d\d:\d\d$/.test(t) ? "-" : "+";
            i = 0 + ("-" == a ? -1 * i : i), r.setMinutes(r.getMinutes() - i - r.getTimezoneOffset())
        } else -1 !== t.indexOf("Z", t.length - 1) && (r = new Date(Date.UTC(r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes(), r.getSeconds(), r.getMilliseconds())));
        return r
    }

    function l(e, r, n) {
        if (t.datetimeAccessFormPaths.length > 0) {
            for (var i = n.split(".#")[0], a = 0; a < t.datetimeAccessFormPaths.length; a++) {
                var s = t.datetimeAccessFormPaths[a];
                if ("string" == typeof s) {
                    if (s == i) break
                } else if (s instanceof RegExp) {
                    if (s.test(i)) break
                } else if ("function" == typeof s && s(obj, r, i)) break
            }
            return a != t.datetimeAccessFormPaths.length ? c(e) : e
        }
        return e
    }

    function u(e, r) {
        if (e.nodeType == A.DOCUMENT_NODE) {
            for (var a = new Object, c = e.childNodes, _ = 0; _ < c.length; _++) {
                var p = c.item(_);
                if (p.nodeType == A.ELEMENT_NODE) {
                    var g = n(p);
                    a[g] = u(p, g)
                }
            }
            return a
        }
        if (e.nodeType == A.ELEMENT_NODE) {
            var a = new Object;
            a.__cnt = 0;
            for (var c = e.childNodes, _ = 0; _ < c.length; _++) {
                var p = c.item(_),
                    g = n(p);
                p.nodeType != A.COMMENT_NODE && (a.__cnt++, null == a[g] ? (a[g] = u(p, r + "." + g), o(a, g, r + "." + g)) : (null != a[g] && (a[g] instanceof Array || (a[g] = [a[g]], o(a, g, r + "." + g))), a[g][a[g].length] = u(p, r + "." + g)))
            }
            for (var d = 0; d < e.attributes.length; d++) {
                var x = e.attributes.item(d);
                a.__cnt++, a[t.attributePrefix + x.name] = f(x.value)
            }
            var h = i(e);
            return null != h && "" != h && (a.__cnt++, a.__prefix = h), null != a["#text"] && (a.__text = a["#text"], a.__text instanceof Array && (a.__text = a.__text.join("\n")), t.escapeMode && (a.__text = s(a.__text)), t.stripWhitespaces && (a.__text = a.__text.trim()), delete a["#text"], "property" == t.arrayAccessForm && delete a["#text_asArray"], a.__text = l(a.__text, g, r + "." + g)), null != a["#cdata-section"] && (a.__cdata = a["#cdata-section"], delete a["#cdata-section"], "property" == t.arrayAccessForm && delete a["#cdata-section_asArray"]), 1 == a.__cnt && null != a.__text ? a = a.__text : 0 == a.__cnt && "text" == t.emptyNodeForm ? a = "" : a.__cnt > 1 && null != a.__text && t.skipEmptyTextNodesForObj && (t.stripWhitespaces && "" == a.__text || "" == a.__text.trim()) && delete a.__text, delete a.__cnt, !t.enableToStringFunc || null == a.__text && null == a.__cdata || (a.toString = function () {
                return (null != this.__text ? this.__text : "") + (null != this.__cdata ? this.__cdata : "")
            }), a
        }
        return e.nodeType == A.TEXT_NODE || e.nodeType == A.CDATA_SECTION_NODE ? f(e.nodeValue) : void 0
    }

    function f(e) {
        if (!t.coerce || "" === e.trim()) return e;
        var r = Number(e);
        if (!isNaN(r)) return r;
        var n = e.toLowerCase();
        return "true" == n ? !0 : "false" == n ? !1 : e
    }

    function _(e, r, n, i) {
        var s = "<" + (null != e && null != e.__prefix ? e.__prefix + ":" : "") + r;
        if (null != n)
            for (var o = 0; o < n.length; o++) {
                var c = n[o],
                    l = e[c];
                t.escapeMode && (l = a(l)), s += " " + c.substr(t.attributePrefix.length) + "='" + l + "'"
            }
        return s += i ? "/>" : ">"
    }

    function p(t, e) {
        return "</" + (null != t.__prefix ? t.__prefix + ":" : "") + e + ">"
    }

    function g(t, e) {
        return -1 !== t.indexOf(e, t.length - e.length)
    }

    function d(e, r) {
        return "property" == t.arrayAccessForm && g(r.toString(), "_asArray") || 0 == r.toString().indexOf(t.attributePrefix) || 0 == r.toString().indexOf("__") || e[r] instanceof Function ? !0 : !1
    }

    function x(t) {
        var e = 0;
        if (t instanceof Object)
            for (var r in t) d(t, r) || e++;
        return e
    }

    function h(e) {
        var r = [];
        if (e instanceof Object)
            for (var n in e) - 1 == n.toString().indexOf("__") && 0 == n.toString().indexOf(t.attributePrefix) && r.push(n);
        return r
    }

    function m(e) {
        var r = "";
        return null != e.__cdata && (r += "<![CDATA[" + e.__cdata + "]]>"), null != e.__text && (r += t.escapeMode ? a(e.__text) : e.__text), r
    }

    function y(e) {
        var r = "";
        return e instanceof Object ? r += m(e) : null != e && (r += t.escapeMode ? a(e) : e), r
    }

    function v(t, e, r) {
        var n = "";
        if (0 == t.length) n += _(t, e, r, !0);
        else
            for (var i = 0; i < t.length; i++) n += _(t[i], e, h(t[i]), !1), n += O(t[i]), n += p(t[i], e);
        return n
    }

    function O(t) {
        var e = "",
            r = x(t);
        if (r > 0)
            for (var n in t)
                if (!d(t, n)) {
                    var i = t[n],
                        a = h(i);
                    if (null == i || void 0 == i) e += _(i, n, a, !0);
                    else if (i instanceof Object)
                        if (i instanceof Array) e += v(i, n, a);
                        else if (i instanceof Date) e += _(i, n, a, !1), e += i.toISOString(), e += p(i, n);
                    else {
                        var s = x(i);
                        s > 0 || null != i.__text || null != i.__cdata ? (e += _(i, n, a, !1), e += O(i), e += p(i, n)) : e += _(i, n, a, !0)
                    } else e += _(i, n, a, !1), e += y(i), e += p(i, n)
                } return e += y(t)
    }
    var T = "1.1.5";
    t = t || {}, e(), r();
    var A = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9
    };
    this.parseXmlString = function (t) {
        var e = window.ActiveXObject || "ActiveXObject" in window;
        if (void 0 === t) return null;
        var r;
        if (window.DOMParser) {
            var n = new window.DOMParser,
                i = null;
            if (!e) try {
                i = n.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI
            } catch (a) {
                i = null
            }
            try {
                r = n.parseFromString(t, "text/xml"), null != i && r.getElementsByTagNameNS(i, "parsererror").length > 0 && (r = null)
            } catch (a) {
                r = null
            }
        } else 0 == t.indexOf("<?") && (t = t.substr(t.indexOf("?>") + 2)), r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(t);
        return r
    }, this.asArray = function (t) {
        return t instanceof Array ? t : [t]
    }, this.toXmlDateTime = function (t) {
        return t instanceof Date ? t.toISOString() : "number" == typeof t ? new Date(t).toISOString() : null
    }, this.asDateTime = function (t) {
        return "string" == typeof t ? c(t) : t
    }, this.xml2json = function (t) {
        return u(t)
    }, this.xml_str2json = function (t) {
        var e = this.parseXmlString(t);
        return null != e ? this.xml2json(e) : null
    }, this.json2xml_str = function (t) {
        return O(t)
    }, this.json2xml = function (t) {
        var e = this.json2xml_str(t);
        return this.parseXmlString(e)
    }, this.getVersion = function () {
        return T
    }
}