import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
    data() {
        return {
            // 全局事件监听的保存
            itemImgListener: null,
        }
    },
    mounted() {
        // 监听item中的图片加载完成
        const refresh = debounce(this.$refs.scroll.refresh,50);
        // 对监听的事件进行保存
        this.itemImgListener = () => {
            refresh();
        };
        this.$bus.$on("itemImageLoad",this.itemImgListener)
        // console.log('我是混入的内容');
    }
}
// 回到顶部
export const backTopMixin = {
    components: {
        BackTop,
    },
    data() {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backTop() {
            this.$refs.scroll.scrollTo(0,0,300)
        },
        listenShowBackTop(position) {
            this.isShowBackTop =  -position.y > 1000
        }
    }
}