import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import vuetify from './vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueCompositionApi, VueAxios, axios)

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
