export default function (p) {
  p.$axios.onError(error => {
    // nuxtError({
    //   statusCode: error.response.status,
    //   message: (error.response.data && error.response.data.errormsg) ? error.response.data.errormsg : error.message,
    // });
    // return Promise.resolve(false);
    if (error.config.errormsg === undefined)
      window.$nuxt.$root.$emit('message', 'Erro', (error.response.data && error.response.data.errormsg) ? error.response.data.errormsg : error.message)
  })
}
