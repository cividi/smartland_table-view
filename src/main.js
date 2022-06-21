import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import vuetify from './vuetify'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueCompositionApi, VueAxios, axios)

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
