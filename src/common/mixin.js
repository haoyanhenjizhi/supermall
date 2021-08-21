import { debounce } from "common/utils"

import BackTop from 'components/content/backTop/BackTop'
// 将闲情页面以及首页的刷新代码 合并到这里来  采用 vue里面的混入


// 这个地方img标签趋势被挂载 但是其中的图片还没有占据高度
// 1.监听item中图片加载完成  注意 是每一张图片加载完成 刷新一次(如果这样操作 就会频繁的对页面进行刷新)
// 所以我们使用防抖函数debounce  来进行性能优化
//这里偶尔会报错的原因 是因为图片已经加载好了 而scroll组件还有没有挂载 就相当于这边
//是在调用null.refresh
// 解决办法 做一层与运算判断是否挂载完成
export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null
    }
  },
  mounted () {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    console.log('woshinengdie');
  }
}

// 封装一下回到顶部
export const backTopMixin = {
  components: {
    BackTop
  },

  data () {
    return {
      isBackTopShow: false,
    }
  },
  methods: {
    backClick () {
      //给要监听的组件添加事件监听方法
      // 这里其实也是这样 不直接拿scroll组件里面的组件对象然后使用里面的那个方法
      // 而是将其封装起来 
      this.$refs.scroll.scrollTo(0, 0)
    },
  }
}