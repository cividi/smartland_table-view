import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
    icons: {
      iconfont: 'mdi',
    },
    /*
    lang: {
      current: navigator.language,
      locales: { ja, en },
      t: (key, ...params) => i18n.t(key, params) as string,
    },
  */
    theme: {
      options: {
        themeCache: {
          // https://vuetifyjs.com/features/theme/#section-30ad30e330c330b730e5
          get: (key) => {
            return localStorage.getItem(JSON.stringify(key));
          },
          set: (key, value) => {
            localStorage.setItem(JSON.stringify(key), value);
          },
        },
        customProperties: true,
      },
    },
  });
  
/** Create Vuetify */
export function createVuetify(options) {
    Vue.use(Vuetify);
    return new Vuetify(options);
}
