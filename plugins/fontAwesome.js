import Vue from 'vue'

import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faShoppingCart,
  faPlus,
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
  faCheck,
  faArrowLeft,
  faHome,
  faEllipsisH,
  faUser,
  faUserClock,
  faUserCheck,
  faUserTimes,
  faSearchMinus,
  faSearchPlus,
  faUserFriends,
  faEnvelopeOpenText,
  faUserTie,
  faPauseCircle,
  faDollarSign,
  faHandHoldingUsd,
  faServer,
  faCreditCard,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import {
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faShoppingCart)
library.add(faPlus)
library.add(faPlusSquare)
library.add(faMinusSquare)
library.add(faWhatsapp)
library.add(faTrashAlt)
library.add(faCheck)
library.add(faArrowLeft)
library.add(faHome)
library.add(faEllipsisH)
library.add(faUser)
library.add(faUserClock)
library.add(faUserCheck)
library.add(faUserTimes)
library.add(faUserFriends)
library.add(faSearchMinus)
library.add(faSearchPlus)
library.add(faEnvelopeOpenText)
library.add(faUserTie)
library.add(faPauseCircle)
library.add(faDollarSign)
library.add(faHandHoldingUsd)
library.add(faServer)
library.add(faCreditCard)
library.add(faCog)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
