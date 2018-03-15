<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)" :key="index">
                        <span class="text border-1px">
                            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="(item, index) in goods" class="food-list food-list-hook" ref="foodHook" :key="index">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food, $event)" v-for="(food, index) in item.foods" class="food-item border-1px" :key="index">
                        <div class="icon">
                            <img width="57" height="57" :src="food.icon">
                        </div>
                        <div class="content">
                            <h2 class="name">{{food.name}}</h2>
                            <p class="desc">{{food.description}}</p>
                            <div class="extra">
                            <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                            </div>
                            <div class="price">
                                <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </div>
                        </li>
                    </ul>
                    </li>
                </ul>
            </div>
            <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        </div>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script type="text/ecmascripts-6">
import BScroll from 'better-scroll'; // 引入滚动样式
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol' 
import food from 'components/food/food'

    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() { 
           
            /** 
                goods需要用data进行传递，后期需要使用到goods，一些状态要反映到dom上，所以给他添加getter setter, 
                也就是说一开始这个goods是空，当这个组件被调用的时候，通过created这个方法就可以给这个goods赋值
            **/
            return {
                goods: [],
                listHeight: [], // 存储每个区间的高度
                scrollY: 0,
                selectedFood: {}
            }
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = []
                this.goods.forEach( (good) => {
                    good.foods.forEach( (food) => {
                        if( food.count ){
                            foods.push(food)
                        }
                    })
                })
                return foods
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.$http.get('/api/goods').then( (response) => {
                response = response.body
                if(response.errno === ERR_OK){
                    this.goods = response.data
                    this.$nextTick( () => { // this.$nextTick 的回调函数中初始化 better-scroll 。因为这个时候，wrapper 的 DOM 已经渲染了
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
            selectMenu(index, event) {
                // event better-scroll派生的点击事件和原生的点击事件有一个区别，就是event._constructed，这个属性是better-scroll才有的，浏览器原生的是没有的，所以可以通过这个进行判断是谁出发了点击事件
                if (!event._constructed) {
                    return;
                }
                let foodList = this.$refs.foodHook;
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 300);
            },
            _initScroll() { // 滚动初始化
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true // 默认派发点击事件 移动端点击只会出发一次，pc端点击的时候会触发两次
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3 // 希望在实时滚动的时候告诉我滚动的位置，相当于探针，这时候就可以监听事件
                });
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                }); // 监听滚动（scroll)事件,pos是实时位置--回调的时候用;接下来就需要将scrollY和左侧的索引通过vue的计算属性computed进行映射
            },
            _calculateHeight() { // 最后将高度跟左侧进行映射
                let foodList = this.$refs.foodHook;
                let height = 0;
                this.listHeight.push(height); // 将第一个高度放进去
                for (let i = 0; i < foodList.length; i++) { // 将每个区间的item的高度进行累加，将累加的结果放入数组中
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectFood(food, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            }
        },
        components: {
            shopcart,
            cartcontrol,
            food
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl";
    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px /* flex有三个属性：是否等分（0否1是）， 是否缩放（0否1是）， 占位多少像素  */
            width: 80px
            background: #f3f5f7
            .menu-item
                display: table /* display:table是垂直居中最好的布局 */
                height: 54px
                width: 56px
                padding: 0 12px
                line-height: 14px
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1px
                    background: #fff
                    font-weight: 700
                    .text
                        border-none()
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 2px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display: table-cell
                    width: 56px
                    vertical-align: middle  /* 垂直居中 */
                    border-1px(rgba(7, 17, 27, 0.1))
                    font-size: 12px
        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147, 153, 159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, 0.1))
                &:last-child
                    border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .desc, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .desc
                        line-height: 12px
                        margin-bottom: 8px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>