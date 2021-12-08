import Vue from 'vue'
import App from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/store'
import './assets/styles/style.scss'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale';
import en from 'element-ui/lib/locale/lang/en';
import VModal from 'vue-js-modal'
import VueInputAutowidth from 'vue-input-autowidth'
import vueDebounce from 'vue-debounce'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(vueDebounce)
Vue.use(VueInputAutowidth)
Vue.use(Element)
locale.use(en)
Vue.use(VModal)
Vue.config.productionTip = false

new Vue({
    created() {
        this.$store.dispatch({ type: 'loadBoards' });
    },
    router,
    store,
    render: h => h(App)
}).$mount('#app')


// Google Maps:
Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAwGiZvHMgXknOgVGzfiqUHedPY-M9aRpM',
      libraries: 'places', // This is required if you use the Autocomplete plugin
    },
})