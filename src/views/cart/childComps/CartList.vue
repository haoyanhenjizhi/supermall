<template>
  <div class="list">
    <scroll class="content"
            ref="scroll">
      <cart-list-item v-for="(item,index) in cartList"
                      :item-info="item"
                      :key="index"></cart-list-item>

    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem.vue'

import { mapGetters } from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem

  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated () {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.list {
  height: calc(100vh - 44px - 49px - 40px);
}
.content {
  height: 100vh;
  overflow: hidden;
}
</style>>
