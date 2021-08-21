<template>

  <nav-bar>
    <div slot="left"
         class="back"
         @click="backClick">
      <img src="~assets/img/common/back.svg"
           alt="">
    </div>
    <div slot="center"
         class="title">
      <div v-for="(item,index) in titles"
           class="title-item"
           :class="{active:currentIndex===index}"
           @click="titleClick(index)">{{item}}</div>
    </div>
  </nav-bar>

</template>

<script>

import NavBar from 'components/common/navbar/NavBar'
export default {
  name: "DetailNavBar",
  components: {
    NavBar
  },
  props: {
    titles: {
      type: Array,
      default: () => {
        return ['商品', '参数', '评论', '推荐']
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    titleClick (index) {
      this.$emit('titleClick', index)
    },
    backClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.title {
  display: flex;
  font-size: 13px;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-high-text);
}
.back img {
  margin-top: 12px;
}
</style>