import decode from "jwt-decode";

const ID_TOKEN_KEY = "siga-jwt-auth";

export default {
  logout() {
    this.clearIdToken();
  },

  getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  getIdToken() {
    return this.getCookie(ID_TOKEN_KEY);
  },

  clearIdToken() {
    document.cookie = ID_TOKEN_KEY + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },

  // Get and store id_token in local storage
  setIdToken(idToken) {},

  isLoggedIn() {
    const idToken = this.getIdToken();
    return !!idToken && !this.isTokenExpired(idToken);
  },

  decodeToken(encodedToken) {
    const decoded = decode(encodedToken);
    if (decoded && decoded.users) {
      const a = decoded.users.split(";");
      decoded.user = {};
      for (let i = 0; i < a.length; i++) {
        const b = a[i].split(",");
        decoded.user[b[0]] = {
          sistema: b[0],
          ieusu: b[1],
          origin: b[2],
          ieentidade: b[3] === "null" ? undefined : b[3],
          entidade: b[4] === "null" ? undefined : b[4],
          ieunidade: b[5] === "null" ? undefined : b[5],
          unidade: b[6] === "null" ? undefined : b[6],
          perfil: b[7] === "null" ? undefined : b[7]
        };
      }
    }
    decoded.company = decoded.email ? decoded.email.split("@")[1] : undefined;
    decoded.isInterno = sistema => (decoded.user[sistema] ? decoded.user[sistema].origin === "int" : false);
    decoded.isExterno = sistema => (decoded.user[sistema] ? decoded.user[sistema].origin === "ext" : false);
    decoded.isMagistrado = () => {
      for (const sistema in decoded.user) {
        if (Object.prototype.hasOwnProperty.call(decoded.user, sistema) && decoded.user[sistema].perfil === "magistrado") return true;
      }
      return false;
    };
    decoded.isDesembargador = () => {
      for (const sistema in decoded.user) {
        if (Object.prototype.hasOwnProperty.call(decoded.user, sistema) && decoded.user[sistema].perfil === "magistrado" && decoded.user[sistema].unidade.startsWith("GAB")) return true;
      }
      return false;
    };
    return decoded;
  },

  getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
  },

  isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  }
};
