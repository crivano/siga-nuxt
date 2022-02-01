import Vue from 'vue'

import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faSearch,
  faStickyNote,
  faShieldAlt,
  faPaperPlane,
  faPlus,
  faLightbulb,
  faInfoCircle,
  faTag,
  faBomb,
  faUserShield,
  faExclamationTriangle,
  faSkullCrossbones,
  faUserSecret,
  faUserGraduate,
  faUser,
  faBan,
  faAddressCard,
  faAmbulance,
  faBalanceScale,
  faBolt,
  faCalendar,
  faFile,
  faFolder,
  faHeart,
  faStar,
  faCertificate,
  faBell,
  faCalendarCheck,
  faBroadcastTower,
  faSmile,
  faClock,
  faInbox,
  faPowerOff,
  faLock,
  faKey,
  faScroll,
  faTruck,
  faShippingFast,
  faCompressArrowsAlt,
  faHourglassStart,
  faGlasses,
  faExchangeAlt,
  faArrowAltCircleUp,
  faUsersCog,
  faCheckCircle,
  faGlobe,
  faHourglassEnd,
  faHourglassHalf,
  faTrashAlt,
  faUsers,
  faCircle,
  faArrowCircleRight,
  faCaretRight,
  faCaretDown,
  faUserSlash,
  faCaretLeft,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons'
// import {
//   faWhatsapp
// } from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  faAccessibleIcon
} from '@fortawesome/free-brands-svg-icons'

library.add(faArrowCircleRight)
library.add(faCircle)
library.add(faPlus)
library.add(faCaretRight)
library.add(faCaretDown)
library.add(faCaretLeft)
library.add(faSearch)
library.add(faStickyNote)
library.add(faShieldAlt)
library.add(faPaperPlane)

library.add(faLightbulb)
library.add(faInfoCircle)
library.add(faTag)
library.add(faBomb)
library.add(faUserShield)
library.add(faExclamationTriangle)
library.add(faSkullCrossbones)
library.add(faUserSecret)
library.add(faUserGraduate)
library.add(faUser)
library.add(faUsers)
library.add(faUserSlash)
library.add(faBan)
library.add(faAccessibleIcon)
library.add(faAddressCard)
library.add(faAmbulance)
library.add(faBalanceScale)
library.add(faBolt)
library.add(faCalendar)
library.add(faFile)
library.add(faFolder)
library.add(faFolderOpen)
library.add(faHeart)
library.add(faStar)
library.add(faCertificate)
library.add(faBell)
library.add(faCalendarCheck)
library.add(faBroadcastTower)
library.add(faSmile)


library.add(faClock)
library.add(faInbox)
library.add(faPowerOff)
library.add(faLock)
library.add(faKey)
library.add(faScroll)
library.add(faTruck)
library.add(faShippingFast)
library.add(faCompressArrowsAlt)
library.add(faHourglassStart)
library.add(faGlasses)
library.add(faExchangeAlt)
library.add(faArrowAltCircleUp)
library.add(faUsersCog)
library.add(faCheckCircle)
library.add(faGlobe)
library.add(faHourglassEnd)
library.add(faHourglassHalf)
library.add(faTrashAlt)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
