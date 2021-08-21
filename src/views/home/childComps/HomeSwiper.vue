<template>
  <swiper :moveRatio="moveRatio">
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image"
             alt=""
             @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'
export default {
  name: "HomeSwiper",
  data () {//这里添加data 可以修改轮播图中的一些属性
    return {
      moveRatio: 0.25,
      isLoad: false//用这个变量记录是否发出去过这个事件
    }

  },
  props: {
    banners: {
      type: Array,
      default () {
        return []
      }
    },
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad () {
      if (!this.isLoad) {//用这个变量记录是否发出去过这个事件
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style>
</style>