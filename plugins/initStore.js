import UtilsBL from '../bl/utils.js'

export default function (context) {
    UtilsBL.init(context)
    context.app.router.onReady(() => context.store.dispatch("init"))
}