<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"></check-button>
      <span class="check-sp">全选</span>
    </div>
    <div class="price">
      合计：￥{{totalPrice}}
    </div>
    <div class="calculate"
         @click="cllcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'


export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice () {
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0)
    },
    checkLength () {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll () {
      // 1.使用filter函数
      // return !(this.$store.state.cartList.filter(item => !item.checked).length)
      // 2.使用find函数
      if (this.$store.state.cartList.length === 0) return false
      return !this.$store.state.cartList.find(item => !item.checked)
      // 3.普通遍历
      // for (let item of this.$store.state.cartList){
      //   if(!item.checked){
      //     return false
      //   }
      // }
      // return true
    }
  },
  methods: {
    checkClick () {
      if (this.isSelectAll) {//全部选中
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {//部分或全部不选中
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    cllcClick () {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  line-height: 40px;
  display: flex;
}

.check-content {
  display: flex;
  align-items: center;
  padding-left: 10px;
  width: 70px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.price {
  margin-left: 20px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: red;
  color: #fff;
  text-align: center;
}
</style>>
