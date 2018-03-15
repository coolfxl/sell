<template>
    <div class="cartcontrol">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascripts-6">
import Vue from 'vue'

    export default {
        props: {
            food: {
                type: Object
            }
        },
        created() {
        },
        methods: {
            addCart(event) {
                if(!event._constructed){
                    return
                }
                if (!this.food.count) { // better-scroll中添加点击事件，要传入一个参数
                    Vue.set(this.food, 'count', 1) // 给某个对象设置某个属性，和属性值
                }else{
                    this.food.count++
                }
            },
            decreaseCart(event) {
                if(!event._constructed){
                    return
                }
                if(this.food.count){
                    this.food.count--
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease, .cart-add
            display: inline-block
            padding: 6px
            .inner
                display: inline-block
                line-height: 24px
                font-size: 24px
                color: rgb(0, 160, 220)
        .cart-count
            display: inline-block
            vertical-align: top 
            width: 12px
            padding-top: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            colof: rgb(147, 153, 159)
        .cart-add
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
</style>