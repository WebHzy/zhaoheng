// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import 'common/fonts/iconfont.css'
import 'common/stylus/base.styl'
import 'common/stylus/reset.styl'
fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/logo.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
