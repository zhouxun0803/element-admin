import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "reset-css"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import jquery from 'jquery'
window.jquery = window.$ = jquery;

import apis from "./http/apis"
Vue.prototype.$apis = apis

// import http from "./http/index"
// Vue.prototype.$http = http

import Crumbs from "./component/Crumbs.vue"
Vue.component("Crumbs", Crumbs)

// vue中导出excel表格模板
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

Vue.prototype.$FileSaver = FileSaver; //设置全局
Vue.prototype.$XLSX = XLSX; //设置全局


import "echarts"
import Echart from "vue-echarts"
Vue.component("v-chart", Echart)

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
