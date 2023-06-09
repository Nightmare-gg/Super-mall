import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
// 初始化EventBus事件总线
Vue.prototype.$bus = new Vue()
// 每个Vue实例的原型对象上都有$emit和$on

// 安装Toast插件 会去执行toast里面的index.js的install函数
Vue.use(Toast)

// 使用懒加载插件
Vue.use(VueLazyLoad, {
  // 占位图片
  loading: require('./assets/img/common/placeholder.png')
})
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
