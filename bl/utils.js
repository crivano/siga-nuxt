export default {
  formatDDMMYYYY(s) {
    if (!s) return
    return (
      s.substring(8, 10) + '/' + s.substring(5, 7) + '/' + s.substring(0, 4)
    )
  },

  formatDDMMYYYYHHMM(s) {
    if (s === undefined) return

    let r =
      s.substring(6, 8) +
      '/' +
      s.substring(4, 6) +
      '/' +
      s.substring(0, 4) +
      ' ' +
      s.substring(8, 10) +
      ':' +
      s.substring(10, 12)
    r = r.replace(' ', '&nbsp;')
    return r
  },

  formatJSDDMMYYYY_AS_HHMM(s) {
    if (s === undefined) return

    let r = this.formatJSDDMMYYYYHHMM(s)
    r = r.replace('&nbsp;', ' às ')
    return r
  },

  convertString2DateYYYYMMDDHHMM(s) {
    if (s === undefined) return

    const r =
      s.substring(0, 4) +
      '-' +
      s.substring(4, 6) +
      '-' +
      s.substring(6, 8) +
      'T' +
      s.substring(8, 10) +
      ':' +
      s.substring(10, 12)
    return new Date(r)
  },

  formatJSDDMMYYYYHHMM(s) {
    if (!s) return
    const r =
      s.substring(8, 10) +
      '/' +
      s.substring(5, 7) +
      '/' +
      s.substring(0, 4) +
      '&nbsp;' +
      s.substring(11, 13) +
      ':' +
      s.substring(14, 16)
    return r
  },

  trunc(s, n, useWordBoundary) {
    if (s.length <= n) {
      return s
    }
    const subString = s.substr(0, n - 1)
    return (
      (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(' ')) :
        subString) + '&hellip;'
    )
  },
  arrayMove(a, oldIndex, newIndex) {
    if (newIndex >= a.length) {
      let k = newIndex - a.length
      while (k-- + 1) {
        a.push(undefined)
      }
    }
    a.splice(newIndex, 0, a.splice(oldIndex, 1)[0])
    return a // for testing purposes
  },
  formatMoney(n, c, d, t) {
    c = isNaN((c = Math.abs(c))) ? 2 : c
    d = d === undefined ? '.' : d
    t = t === undefined ? ',' : t
    const s = n < 0 ? '-' : ''
    const i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ''
    let j = i.length
    j = j > 3 ? j % 3 : 0
    return (
      s +
      (j ? i.substr(0, j) + t : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
      (c ?
        d +
        Math.abs(n - i)
        .toFixed(c)
        .slice(2) :
        '')
    )
  },
  logEvento(categoria, acao, rotulo, valor) {
    try {
      /* global ga */
      /* eslint no-undef: "error" */
      ga('send', 'event', categoria, acao, rotulo, valor)
    } catch (ex) {}
  },
  camelCaseToDash(s) {
    return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
  },

  // Filtra itens por uma string qualquer. Se desejar restringir o filtro apenas a algumas das propriedades,
  // informar o parâmetro propriedades na forma: ['propriedade','outraPropriedade','lista.propriedade']
  filtrarPorSubstring(a, s, propriedades) {
    const re = new RegExp(s, 'i')
    return a.filter(function filterItem(item, idx, arr, context) {
      for (const key in item) {
        if (!(key in item)) continue
        let prop = context
        prop = context === undefined ? key : context + '.' + key
        if (Array.isArray(item[key])) {
          for (let i = 0; i < item[key].length; i++) {
            if (filterItem(item[key][i], i, item[key], prop)) return true
          }
        }
        if (propriedades && !propriedades.includes(prop)) continue
        if (typeof item[key] === 'string' && re.test(item[key])) {
          return true
        }
        if (typeof item[key] === 'object' && filterItem(item[key], 0, arr, prop)) {
          return true
        }
      }
      return false
    })
  },

  absoluteUrl(base, relative) {
    const stack = base.split('/')
    const parts = relative.split('/')
    stack.pop() // remove current file name (or empty string) (omit if "base" is the current folder without trailing slash)
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '.') continue
      if (parts[i] === '..') stack.pop()
      else stack.push(parts[i])
    }
    return stack.join('/')
  },

  applyDefauts(obj, defaults) {
    for (const k in defaults) {
      if (!(k in defaults)) continue
      if (k in obj) continue
      obj[k] = defaults[k]
    }
    return obj
  },

  overrideProperties(obj, source) {
    for (const k in source) {
      if (!(k in source)) continue
      obj[k] = source[k]
    }
  },

  errormsg(error, component) {
    component.errormsg = error.data.errormsg
    if (
      component.errormsg === undefined &&
      error.statusText &&
      error.statusText !== ''
    ) {
      component.errormsg = error.statusText
    }
    if (component.errormsg === undefined) {
      component.errormsg = 'Erro desconhecido!'
    }
  },

  quietBatch(arr, callbackNext, callbackEnd, index) {
    if (index === undefined) index = 0
    if (index >= arr.length) {
      if (callbackEnd) callbackEnd(arr)
      return
    }
    callbackNext(arr[index], () => {
      this.quietBatch(arr, callbackNext, callbackEnd, index + 1)
    })
  },

  getUTF8Length(string) {
    let utf8length = 0
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)
      if (c < 128) {
        utf8length++
      } else if (c > 127 && c < 2048) {
        utf8length = utf8length + 2
      } else {
        utf8length = utf8length + 3
      }
    }
    return utf8length
  },

  clipUTF8Length(string, length) {
    let utf8length = 0
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)
      if (c < 128) {
        utf8length++
      } else if (c > 127 && c < 2048) {
        utf8length = utf8length + 2
      } else {
        utf8length = utf8length + 3
      }
      if (utf8length > length) return string.substring(0, n)
    }
    return string
  },

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const f = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    const r = ("" + f).replace(".", ",");
    return r + " " + sizes[i];
  },

  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaaaeeeeiiiioooouuuunc------";

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .replace(/^-+/, "") // trim - from start of text
      .replace(/-+$/, ""); // trim - from end of text

    return str;
  },

  onlyLettersAndNumbers(s) {
    if (!s) return
    return s.replace(/[^a-z0-9]/gi, "")
  },

  buildHierarchy(input, id, label) {
    const output = [];
    const allNodes = [];
    for (let i = 0; i < input.length; i++) {
      const chain = input[i][label].split(": ");
      let currentNode = output;
      for (let j = 0; j < chain.length; j++) {
        const wantedNode = chain[j];
        const lastNode = currentNode;
        let k = 0
        for (; k < currentNode.length; k++) {
          if (currentNode[k].label === wantedNode) {
            currentNode = currentNode[k].children;
            break;
          }
        }
        // If we couldn't find an item in this list of children
        // that has the right name, create one:
        if (lastNode === currentNode) {
          const newNode = currentNode[k] = {
            id: (j === chain.length - 1) ? input[i][id] : chain.slice(0, j + 1).join(": "),
            label: wantedNode,
            children: []
          };
          allNodes.push(newNode);
          currentNode = newNode.children;
        }
      }
    }

    for (let i = 0; i < allNodes.length; i++)
      if (allNodes[i].children.length === 0)
        delete allNodes[i].children;

    return output;
  },

  encodeFormParams(formParams) {
    let s = "";
    for (const k in formParams) {
      if (formParams[k] === undefined || formParams[k] === '') continue
      if (s !== "") s += "&";
      s += k + "=" + encodeURIComponent(formParams[k]);
    }
    return s;
  }

}
