import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const store = new Vuex.Store({
    state: {
        cartList: []
    },
    mutations: {
        // addCart(state,payload) {
        //     // payload新添加的商品
        //     // let oldProduct = null;
        //     // for(let item of state.cartList) {
        //     //     if(itemListenerMixin.iid === payload.iid){
        //     //         oldProduct = item
        //     //     }
                
        //     // }
        //     // 1.查找之前数组中是否有该商品
        //     let oldProduct = state.cartList.find(item => item.iid === payload.iid)

        //     // 2.判断oldProduct+1或者新添加
        //     if(oldProduct) {
        //         oldProduct.count += 1
        //     }else {
        //         payload.count = 1
        //         state.cartList.push(payload)
        //     }
        // }
        // mutations唯一的目的就是修改state中的状态
        // mutations中的每个方法尽可能完成的事件比较单一一点
        // 数量+1
        addCounter(state,payload) {
            payload.count++;
        },
        // 新添加商品
        addToCart(state,payload) {
            // 商品是否选中
            payload.checked=true;
            state.cartList.push(payload)
        }
    },
    actions: {
        // 有判断逻辑建议放到actions里面
        addCart(context,payload) {
            return new Promise((reslove,reject)=> {
                // payload新添加的商品
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            // 2.判断oldProduct +1或者新添加 做了两件事，放actions里面比较好
            if(oldProduct) {
                context.commit('addCounter',oldProduct)
                reslove('当前商品数量+1')
            } else {
                payload.count = 1;
                context.commit('addToCart',payload)
                reslove('新商品添加成功')
            }
            })
        }
    },
    getters
})

// 3.挂载到Vue实例上
export default store
