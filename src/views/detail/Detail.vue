<template>
    <div id="detail">
        <DetailNavBar class="detail-nav" @titleClick="titleClick" ref="nav"></DetailNavBar>
        <scroll class="content" 
        ref="scroll"
        :probe-type="3"
        @scroll="contentScroll"
        >
            <DetailSwiper :top-images="topImages"></DetailSwiper>
        <DetailBaseInfo :goods="goods"/>
        <DetailShopInfo :shop="shop"/>
        <DetailGoodsInfo :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <DetailParamInfo :param-info="paramInfo" ref="param"/>
        <DetailCommentInfo :comment-info="commentInfo" ref="comment"/>
        <GoodsList :goods="recommends" ref="recommend"/>
    </scroll>
    <!-- 底部工具栏 -->
    <DetailBottomBar @addToCart="addToCart"/>
    <!-- 回到顶部按钮 -->
    <back-top @click.native="backTop" v-show="isShowBackTop" @addToCart="addToCart"/>
    </div>
</template>


<script>

import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from'./childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import { itemListenerMixin ,backTopMixin} from 'common/mixin'
import { debounce } from '@/common/utils'

import {mapActions} from 'vuex'
export default {
    name: 'Detail',
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            // 标题内容对应的y值
            themeTopYs: [],
            // 防抖
            getThemeTopY: null,
    };
},
    created() {
        // 1.保存传入的iid
        this.iid = this.$route.params.iid
        // 2.根据iid请求详情数据
         getDetail(this.iid).then((res) => {
    //   console.log(res);
    //   1.获取数据
      const data = res.result
    //  2.获取轮播图数据
      this.topImages = data.itemInfo.topImages
        // 3.获取商品信息数据
        this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        // 4.获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 5.获取商品详情数据
        this.detailInfo = data.detailInfo
         // 6.获取参数信息
         this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        // 7.获取评论信息
        if(data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
        }
        })
        // 3.请求推荐数据
        getRecommend().then(res => {
            // console.log(res);
            this.recommends=res.data.list
        })
        // 4.给getThemeTopY赋值(对给this.themeTopYs负责的操作进行防抖)
        this.getThemeTopY = debounce(()=> {
            // 先清空，不然不止4个值
            this.themeTopYs= [];
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.param.$el.offsetTop);
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
            // js里面number的最大值
            this.themeTopYs.push(Number.MAX_VALUE);
        },100)
},
// 取消全局事件监听，因为没有keep-active所以没有deactive勾子
    destroyed() {
        this.$bus.$off('itemImgLoad',this.itemListener)
    },
    methods: {
    ...mapActions(['addCart']),
    imageLoad() {
        this.$refs.scroll.refresh()
        // 获取4个主题的offsetTop
        this.getThemeTopY();
    },
    // 点击标题，滚动到对应内容
    titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
    },
    // 监听滚动到那个主题
    contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y
        // 2.postioY和主题中的值进行对比
        // [0,7938,9120,9452]
        // positionY 在0 和 7938之间，index = 0
        // positionY 在7938 和 9120之间， index = 1
        // positionY 在9120 和 9452之间， index = 2
        // positionY 大于等于 9452时，index=3
        let length = this.themeTopYs.length
        // 方法一：直接分别比较
        // for(let i = 0; i< length; i++) {
        //     // 判断this.currentIndex != i 避免频繁打印
        //     if(this.currentIndex != i && (i<length-1 && positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i+1] ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //         this.currentIndex = i;
        //         console.log(this.currentIndex);
        //         this.$refs.nav.currentIndex = this.currentIndex
        //     }
            
        // }
        // 方法二 hack做法，引入一个最大值与最后一个值进行比较
        for(let i = 0; i < length; i++) {
            if(this.currentIndex !=i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
                this.currentIndex = i
                console.log(this.currentIndex);
                this.$refs.nav.currentIndex = this.currentIndex
            }
        }
        // 3.是否显示回到顶部
        this. listenShowBackTop(position)
    },
    // 点击添加到购物车
    addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

        // 2.将商品添加到购物车里
        // 调用mumation
        // this.$store.commit('addCart',product)
        // 调用action
        // this.$store.dispatch('addCart', product)
        this.addCart(product).then(res=> {
            // console.log(res);
            this.$toast.show(res)
        })
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
        background-color: #fff;
    }
    .content {
        height: calc(100% - 44px);
    }
    

</style>