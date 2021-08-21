<template>
  <div id="detail">
    <detail-nav-bar @titleClick="selectIndex"
                    class="detail-nav"
                    :current-index="currentIndex" />
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo"
                         ref="param" />
      <detail-comment-info :comment-info="commentInfo"
                           ref="comment"></detail-comment-info>
      <goods-list :goods="recommends"
                  ref="recommend" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick"
              v-show="isBackTopShow"></back-top>
    <toast />
  </div>
</template>

<script>
import DetailNavBar from 'views/detail/childComps/DetailNavBar'//头部导航栏组件
import DetailSwiper from './childComps/DetailSwiper.vue'//轮播图组件
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'//商品基本信息组件
import DetailShopInfo from './childComps/DetailShopInfo.vue'//店铺信息组件
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'//商品详情信息的展示
import DetailParamInfo from './childComps/DetailParamInfo.vue'//参数信息展示组件
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'//商品评论信息的展示
import DetailBottomBar from './childComps/DetailBottomBar.vue'//底部导航栏组件


import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'


import { getDetail, Goods, Shop, getRecommend, GoodsParam } from "network/detail"//多个信息封装成类

import { itemListenerMixin, backTopMixin } from 'common/mixin'//混入

import { mapActions } from 'vuex'


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailGoodsInfo,
    DetailBaseInfo,//这个组件是对商品信息进行展示
    DetailShopInfo,//这个组件对店铺信息进行一个展示
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast,


  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTops: [],
      currentIndex: 0,
      message: '',
      show: false

    }
  },
  created () {
    // 保存传入的iid
    this.iid = this.$route.params.iid

    // 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      // 1.获取数据
      const data = res.result
      // 2.获取顶部的图片轮播数据

      this.topImages = data.itemInfo.topImages
      // console.log(this.topImages);

      //3.获取商品信息 创建商品信息对象
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // console.log(this.goods);
      // 4.创建店铺信息对象
      this.shop = new Shop(data.shopInfo)
      // console.log(this.shop);

      // 5.保存商品的详情数据
      this.detailInfo = data.detailInfo
      // console.log(this.detailInfo);
      // 6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 7.保存评论数据
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    })

    //  请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })

  },

  destroyed () {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad () {
      this.$refs.scroll.refresh()
      // 获取对应的offsetTop
      this.themeTops = []
      this.themeTops.push(0)
      this.themeTops.push(this.$refs.param.$el.offsetTop)
      this.themeTops.push(this.$refs.comment.$el.offsetTop)
      this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      this.themeTops.push(Number.MAX_VALUE)
    },
    addToCart () {
      //  1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(this.detailInfo);
      console.log(product.price);
      // console.log(product.desc);
      // console.log(product.title);

      //  2.将数据放到购物车界面里面
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)
        this.$toast.show(res, 2000)
      })
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })

      // 3.添加到购物车成功
    },
    selectIndex (index) {
      this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
      // console.log(1231);
    },

    //回到顶部小图标显示隐藏方法
    contentScroll (position) {
      // 1.判断把backtop是否显示
      this.isBackTopShow = -position.y > 1000

      // 监听滚动到某个主题
      this._listenScrollTheme(-position.y)
    },
    _listenScrollTheme (position) {
      let length = this.themeTops.length;
      for (let i = 0; i < length; i++) {
        let iPos = this.themeTops[i];
        if (position >= iPos && position < this.themeTops[i + 1]) {
          if (this.currentIndex !== i) {
            this.currentIndex = i;
          }
          break;
        }
      }
    },

  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  transform: translateZ(999px);
  background-color: #fff;
}
.content {
  height: calc(100% - 44px);
}
</style>>

