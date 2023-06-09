<template>
<div class="check-button" :class="{check: isChecked}">
   <!-- 这个图片是一个白色的勾 选中就改背景颜色 -->
    <img src="~/assets/img/cart/tick.svg" alt="">
</div>

</template>

<script>
export default {
    name: "CheckButton",
    props: {
        isChecked: {
            // 是否选中
            type: Boolean,
            default: true,
        }
    }
}
</script>

<style scoped>
.check-button {
    border-radius: 50%;
    border: 2px solid #aaa;
}

.check {
    border-color: var(--color-tint);
    background-color:  var(--color-tint);
}
</style>