export default function (p) {
  p.$axios.onError(error => {
    // nuxtError({
    //   statusCode: error.response.status,
    //   message: (error.response.data && error.response.data.errormsg) ? error.response.data.errormsg : error.message,
    // });
    // return Promise.resolve(false);
    if (error.config.errormsg === undefined) {
      const msg = (error.response.data && error.response.data.errormsg) ? error.response.data.errormsg : error.message
      // if (error.config.url === 'siga/api/v1/usuario') throw msg
      if (error.response.status === 401) {
        window.$nuxt.$root.$emit('loginRequired')
      } else {
        window.$nuxt.$root.$emit('message', 'Erro', msg)
      }
    }
  })
}
