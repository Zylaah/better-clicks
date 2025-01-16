import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icônes essentielles pour le chargement initial
import { 
    faHome,
    faArrowLeft,
    faBook,
    faFolderTree,
    faCode,
    faKeyboard,
    faInfoCircle,
    faDesktop,
    faWindowMinimize,
    faWindowMaximize,
    faWindowClose,
    faGraduationCap,
    faGlobe,
    faShieldHalved,
    faClock,
    faStar,
    faWifi,
    faSun
} from '@fortawesome/free-solid-svg-icons'

// Ajout des icônes essentielles
library.add(
    faHome,
    faArrowLeft,
    faBook,
    faFolderTree,
    faCode,
    faKeyboard,
    faInfoCircle,
    faDesktop,
    faWindowMinimize,
    faWindowMaximize,
    faWindowClose,
    faGraduationCap,
    faGlobe,
    faShieldHalved,
    faClock,
    faStar,
    faWifi,
    faSun
)

// Fonction pour charger dynamiquement les icônes
const loadIcon = async (iconName) => {
    try {
        const iconModule = await import('@fortawesome/free-solid-svg-icons');
        const iconKey = `fa${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}`;
        if (iconModule[iconKey]) {
            library.add(iconModule[iconKey]);
        } else {
            console.warn(`L'icône ${iconName} n'existe pas dans free-solid-svg-icons`);
        }
    } catch (error) {
        console.warn(`Impossible de charger l'icône ${iconName}:`, error);
    }
};

// Fonction pour charger les icônes de marques
const loadBrandIcon = async (iconName) => {
    try {
        const iconModule = await import('@fortawesome/free-brands-svg-icons');
        const iconKey = `fa${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}`;
        if (iconModule[iconKey]) {
            library.add(iconModule[iconKey]);
        } else {
            console.warn(`L'icône ${iconName} n'existe pas dans free-brands-svg-icons`);
        }
    } catch (error) {
        console.warn(`Impossible de charger l'icône de marque ${iconName}:`, error);
    }
};

const app = createApp(App)
const pinia = createPinia()

// Rendre les fonctions de chargement d'icônes disponibles globalement
app.config.globalProperties.$loadIcon = loadIcon;
app.config.globalProperties.$loadBrandIcon = loadBrandIcon;

app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

// Préchargement des ressources critiques
import { preloadCriticalResources } from '@/utils/preloader'

preloadCriticalResources().then(() => {
  router.isReady().then(() => {
    if (router.currentRoute.value.path !== '/') {
      router.push('/')
    }
  })

  app.mount('#app')
})
