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
    faChevronDown
} from '@fortawesome/free-solid-svg-icons'

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
    faChevronDown
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
