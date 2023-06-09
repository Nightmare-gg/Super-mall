<template>
<!-- 类名与外界相同也不要紧，style有个scoped属性会限制作用域 -->
<div class="wrapper" ref="wrapper">
    <div class="content">
        <slot></slot>
    </div>
</div>

</template>

<script>
// !!!视频用的是1.13.2版本，用最新版本不行
import BScroll from "better-scroll"
export default {
    name: "Scroll",
    data() {
        return {
            scroll: null,//把scroll对象存在这个组件的数据里面
        };
    },
    props: {
        probeType: {
            type: Number,
            default:0
        },
        pullUpLoad: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {
        // 1.ew BScroll(指定挂载，对象要求)
        this.scroll = new BScroll(this.$refs.wrapper, {
        //  不设置这里的话better-scroll包裹的内容中div,span等无法点击
            click: true,
            // 设置监听滚动位置
            probeType: this.probeType,
            // 上拉 踩坑pullUpLoad L为大写字母
            pullUpLoad: this.pullUpLoad,
            // observeDOM: true, 这个不设置滚动条会失效

        });
        // 2.监听滚动的位置
       if(this.probeType===2 || this.probeType===3) {
        this.scroll.on("scroll",(position)=>{
            this.$emit("scroll",position)
        });
       }
        // 3.监听scroll滚动到底部 上拉加载更多
        if(this.pullUpLoad) {
            this.scroll.on("pullingUp",()=> {
                // console.log('上拉');
            this.$emit("pullingUp");
        });
        
    }
    },
    methods: {
        // 点击回到某个位置
        scrollTo(x,y,time=300) {
           this.scroll && this.scroll.scrollTo(x,y,time)
        },
        // 刷新
        refresh() {
            // console.log('-----');
          this.scroll && this.scroll.refresh();
        },
        // 完成上拉加载更多
        finishPullUp() {
           this.scroll && this.scroll.finishPullUp();
        },
        // 获取位置y 记录离开位置
        getScrollY() {
            return this.scroll ? this.scroll.y : 0
        }
    },
};

</script>

<style>

</style>