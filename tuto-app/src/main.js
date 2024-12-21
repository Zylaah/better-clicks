import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faHome,
    faCode,
    faInfoCircle,
    faFolderTree,
    faSearch,
    faComputer,
    faGlobe,
    faShieldHalved,
    faKeyboard,
    faWifi,
    faClock,
    faUser,
    faSun,
    faMoon,
    faLightbulb,
    faCheckCircle,
    faCircle,
    faArrowLeft,
    faArrowRight,
    faFolder,
    faStar,
    faLaptopCode,
    faMobile,
    faDatabase,
    faRoad,
    faSignal,
    faGraduationCap,
    faBook,
    faFolderOpen,
    faFile,
    faEdit,
    faTrash,
    faChevronRight,
    faChevronDown,
    faBullseye,
    faUsers,
    faEnvelope,
    faMinus,
    faExpand,
    faTimes,
    faWindowMinimize,
    faWindowMaximize,
    faWindowClose,
    faCheck,
    faXmark,
    faTools,
    faHardHat
} from '@fortawesome/free-solid-svg-icons'

import {
    faTwitter,
    faGithub,
    faLinkedin,
    faInstagram,
    faYoutube
} from '@fortawesome/free-brands-svg-icons'

library.add(
    faHome,
    faCode,
    faInfoCircle,
    faFolderTree,
    faSearch,
    faComputer,
    faGlobe,
    faShieldHalved,
    faKeyboard,
    faWifi,
    faClock,
    faUser,
    faSun,
    faMoon,
    faLightbulb,
    faCheckCircle,
    faCircle,
    faArrowLeft,
    faArrowRight,
    faFolder,
    faStar,
    faLaptopCode,
    faMobile,
    faDatabase,
    faRoad,
    faSignal,
    faGraduationCap,
    faBook,
    faFolderOpen,
    faFile,
    faEdit,
    faTrash,
    faChevronRight,
    faChevronDown,
    faBullseye,
    faUsers,
    faEnvelope,
    faMinus,
    faExpand,
    faTimes,
    faTwitter,
    faGithub,
    faLinkedin,
    faInstagram,
    faYoutube,
    faWindowMinimize,
    faWindowMaximize,
    faWindowClose,
    faCheck,
    faXmark,
    faTools,
    faHardHat
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

// S'assurer que l'application démarre sur la page d'accueil
router.isReady().then(() => {
    if (router.currentRoute.value.path !== '/') {
        router.push('/')
    }
})

app.mount('#app')
