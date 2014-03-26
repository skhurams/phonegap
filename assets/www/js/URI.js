/**
 * URI.js by zzzzBov
 */
(function (w) {
  "use strict";
  var URI = function (str) {
    if (!this) {
      return new URI(str);
    }
    if (!str) {
      str = window.location.toString();
    }
    var parts, uriRegEx, hostParts;
    //http://labs.apache.org/webarch/uri/rfc/rfc3986.html#regexp
    uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    str = str.toString();
    parts = uriRegEx.exec(str);
    this.protocol = parts[1] || '';
    this.host = parts[4] || '';
    this.pathname = parts[5] || '';
    this.search = parts[6] || '';
    this.hash = parts[8] || '';
    //logic to break host into hostname:port
    hostParts = this.host.split(':');
    this.hostname = hostParts[0] || '';
    this.port = hostParts[1] || '';
  };
  URI.prototype = {
    getQuery: function (i) {
      var o;
      o = URI.parseQueryString(this.search);
      return i === undefined ? o : o[i];
    },
    setQuery: function (val) {
      var s;
      s = URI.buildQueryString(val);
      this.search = s.length ? '?' + s : s;
    },
    toString: function () {
      return this.protocol + '//' + this.host + this.pathname + this.search + this.hash;
    }
  };
  URI.parseQueryString = function (str) {
    var obj, vars, i, l, data, rawKey, rawVal, key, val;
    obj = {};
    if (!str) {
      return obj;
    }
    //make sure it's a string
    str = str.toString();
    if (!str.length || str === '?') {
      return obj;
    }
    //remove `?` if it is the first char
    if (str[0] === '?') {
      str = str.substr(1);
    }
    vars = str.split('&');
    for (i = 0, l = vars.length; i < l; i += 1) {
      data = vars[i].split('=');
      rawKey = data[0];
      rawVal = data.length > 1 ? data[1] : '';
      //if there's a key, add a value
      if (rawKey) {
        key = URI.decode(rawKey);
        val = URI.decode(rawVal);
        //check if obj[key] is set
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string') {
            //if it's a string turn it to an array
            obj[key] = [ obj[key], val ];
          } else {
            //it's an array, push
            obj[key].push(val);
          }
        } else {
          obj[key] = val;
        }
      }
    }
    return obj;
  };
  URI.buildQueryString = function (obj) {
    var arr, key, val, i;
    function build(key, value) {
      var eKey, eValue;
      eKey = URI.encode(key);
      eValue = URI.encode(value);
      if (eValue) {
        arr.push(eKey + '=' + eValue);
      } else {
        arr.push(eKey);
      }
    }
    arr = [];
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        val = obj[key];
        //isArray check
        if (Object.prototype.toString.call(val) === '[object Array]') {
          for (i in  val) {
            if (val.hasOwnProperty(i)) {
              build(key, val[i]);
            }
          }
        } else {
          build(key, val);
        }
      }
    }
    return arr.join('&');
  };
  URI.decode = decodeURIComponent;
  URI.encode = encodeURIComponent;
  w.URI = URI;
}(window));