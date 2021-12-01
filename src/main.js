import Vue from 'vue'
import App from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/store'
import './assets/styles/style.scss'

Vue.config.productionTip = false

new Vue({
    created() {
        this.$store.dispatch({ type: 'loadBoards' });
    },
    router,
    store,
    render: h => h(App)
}).$mount('#app')