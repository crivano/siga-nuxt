export default {
  fix(s) {
    // remover scripts
    s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // trocar onclick por @change
    s = s.replace(/ onclick="/gi, '@change="')
    // substituir o ckeditor
    s = s.replace(/<textarea id="(?<id>[^"]+)" name="(?<name>[^"]+)" class="editor">(?<content>.*?)<\/textarea>/gis, '<ckeditor v-on:input="setHidden(\'$<name>\', $event)" value="$<content>"></ckeditor><input type="hidden" ref="hidden_$<name>" name="$<name>">');
    // console.log(s)
    return s;
  },

  getFormResults(formElement) {
    const setOrPush = function (target, val) {
      let result = val;
      if (target) {
        result = [target];
        result.push(val);
      }
      return result;
    }
    const formElements = formElement.elements;
    const formParams = {};
    let i = 0;
    let elem = null;
    for (i = 0; i < formElements.length; i += 1) {
      elem = formElements[i];
      switch (elem.type) {
        case 'submit':
          break;
        case 'radio':
          if (elem.checked) {
            formParams[elem.name] = elem.value;
          }
          break;
        case 'checkbox':
          if (elem.checked) {
            formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
          }
          break;
        default:
          formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
      }
    }
    return formParams;
  },

  encodeFormParams(formParams) {
    let s = "";
    for (const k in formParams) {
      if (s !== "") s += "&";
      s += k + "=" + encodeURIComponent(formParams[k]);
    }
    return s;
  }

}
