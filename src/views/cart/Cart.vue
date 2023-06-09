<template>
 <div class="cart">
  <!-- 导航 -->
    <nav-bar class="nav-bar">
    <div slot="center"> 购物车({{length}}) </div>
    </nav-bar>
    <!-- 当前列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar/>
 </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList.vue';
import CartBottomBar from './childComps/CartBottomBar.vue';

import {mapGetters} from 'vuex'
  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar,
    },
    computed: {
      // cartLength() {
      //   return this.$store.state.cartList.length;
      // }
      // mapGetters辅助函数混入getter
      // 两种语法
      // 1.使用对象展开运算符将getter混入computed对象中
      // ...mapGetter(['cartLength','cartList'])
      // 2.将一个getter属性另外取一个名字，使用对象形式
      ...mapGetters({
        length: 'cartLength',
        // list: 'cartList'
      })
    }
  }
</script>

<style scoped>
.cart{
  height: 100vh;
}

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
