import Vue from 'vue'
import App from './App'
import store from './store' // store
import plugins from './plugins' // plugins
import i18n from './i18n'
import BorderImage from '@/assets/images/list/jili.webp'
import { installRouterCompat } from '@/utils/business-router'
import './permission' // permission
import { getDicts } from "@/api/system/dict/data"
import { Tabbar, TabbarItem, Loading, Button, List } from 'vant'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import "vant/lib/index.css";

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Loading)
Vue.use(Button)
Vue.use(List)

Vue.use(VueAwesomeSwiper)

Vue.use(plugins)
Vue.use(i18n)
installRouterCompat(Vue)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.getDicts = getDicts
Vue.prototype.$jili = BorderImage
Vue.prototype.$safe = function(obj, ...paths) {
  return paths.reduce((target, key) => {
    if (target === null || target === undefined) {
      return undefined
    }
    return target[key]
  }, obj)
}
Vue.prototype.safe = Vue.prototype.$safe
Vue.prototype.$toast = {
  fail(message) {
    uni.showToast({
      title: message || 'Error',
      icon: 'none'
    })
  },
  success(message) {
    uni.showToast({
      title: message || 'Success',
      icon: 'success'
    })
  }
}

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})

app.$mount()
