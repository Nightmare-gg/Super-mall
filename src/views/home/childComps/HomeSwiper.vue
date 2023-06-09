<template>
    <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
    import {Swiper, SwiperItem} from "components/common/swiper"
export default {
    name: "HomeSwiper",
    components: {
        Swiper,
        SwiperItem,
    },
    props: {
        banners: {
            type: Array,
            default(){
                return []
            }
        }
    },
    data() {
        return {
            // 标记是否emit过
            isLoad: false
        };
    },
    methods: {
        // 只发送一次
        imageLoad() {
            if(!this.isLoad) {
                this.$emit("swiperImageLoad");
                this.isLoad = true;
}
        }
    },
}
</script>

<style>

</style>