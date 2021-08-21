import Toast from './Toast'
// 以插件的形式安装totast  不需要从detail里面组件通信传值
const obj = {}

obj.install = function (Vue) {

  //  1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  const toast = new toastContrustor()
  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el)
  Vue.prototype.$toast = toast
}
export default obj