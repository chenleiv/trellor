import Vue from 'vue'
import App from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/store'
import './assets/styles/style.scss'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
    created() {
        this.$store.dispatch({ type: 'loadBoards' });
    },
    router,
    store,
    render: h => h(App)
}).$mount('#app')