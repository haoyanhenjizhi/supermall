import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'


export default {
  addCart (context, payload) {
    return new Promise((resolve, reject) => {
      // payload 新添加的商品
      let oldproduct = context.state.cartList.find((item) => {
        return item.iid === payload.iid
      })
      // 2.判断oldproduct
      if (oldproduct) {//数量加1
        // oldproduct.count += 1
        context.commit(ADD_COUNTER, oldproduct)
        resolve('当前的商品数量+1')
      } else {//添加新的商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}