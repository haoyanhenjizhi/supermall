<template>
  <div class="goods-list">
    <goods-list-item v-for="item in goods"
                     :goods-item="item"
                     class="item" />
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style>
.goods-list {
  display: flex;
  /* 选择这个属性会让宽度来决定一行显示多少个元素 */
  flex-wrap: wrap;
  padding: 5px;
  justify-content: space-around;
}

.goods-list .item {
  width: 48%;
}
</style>