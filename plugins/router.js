export default ({ app }) => {
  // Redirect to the vRaptor
  app.router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/siga')) {
      next(false)
      window.location = process.env.API_URL_BROWSER + to.path.slice(1);
    } else if (to.path.startsWith('/conhecimento/')) {
      next(false)
      window.location = process.env.API_URL_BROWSER + 'sigagc/app/exibir/' + to.params.numero;
    } else if (to.path.startsWith('/solicitacao/')) {
      next(false)
      window.location = process.env.API_URL_BROWSER + 'sigasr/app/solicitacao/exibir/' + to.params.numero;
    } else next()
  })

}