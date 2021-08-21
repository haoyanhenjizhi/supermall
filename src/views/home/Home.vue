<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabcontrol1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabcontrol2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick"
              v-show="isBackTopShow"></back-top>
  </div>
</template>

<script>

import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl.vue'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMultidata, getHomeGoods } from 'network/home';


import { itemListenerMixin } from 'common/mixin'


export default {
  name: "Home",
  components: {

    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop

  },
  mixins: [itemListenerMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',
      isBackTopShow: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods () {//在这里通过这个计算属性动态的展示数据
      return this.goods[this.currentType].list
    }
  },
  activated () {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()//这里最好刷新一次 不然可能会出现错误
  },
  deactivated () {
    // 1.保存Y值使回来的时候保持原样
    this.saveY = this.$refs.scroll.getScrollY()

    // 2.取消全局事件监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  created () {
    //  1.请求多个数据
    this.getHomeMultidata()


    // 2.请求商品数据并存放到goods里面
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    /*
      事件监听相关的方法
 
    */

    tabClick (index) {//tabcontrol发送事件到父组件 传递三个选项的index 
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
      this.$refs.tabcontrol1.currentIndex = index;
      this.$refs.tabcontrol2.currentIndex = index;
    },
    //回到顶部处理方法
    backClick () {
      //给要监听的组件添加事件监听方法
      // 这里其实也是这样 不直接拿scroll组件里面的组件对象然后使用里面的那个方法
      // 而是将其封装起来 
      this.$refs.scroll.scrollTo(0, 0)
    },
    //回到顶部小图标显示隐藏方法
    contentScroll (position) {
      // 1.判断把backtop是否显示
      this.isBackTopShow = -position.y > 1000

      // 2.决定tabcontrol是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore () {
      this.getHomeGoods(this.currentType)
    },
    // 2.获取tabcontrol的offsettop
    // 所有组件都有一个属性$el：用于获取组件中的元素

    swiperImageLoad () {
      this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop
    },


    // 将网络请求数据函数封装到方法里面
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        //每次触发上拉动作后 在回调函数的最后 都应该调用finishPullUp方法
        // 我们不在这里直接拿这个scroll组件里面的组件对象 而是将它封装到scroll组件
        // 的方法里面
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9; */
}

.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
  transform: translateZ(999px);
}
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>