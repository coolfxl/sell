<template>
  <div id="app">
    <v-header :seller="sellers"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
         <router-link :to="{path:'/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
         <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="sellers"></router-view> <!-- router-view 将参数进行传递，也就是当页面上显示的那一层view就会关联这个seller对象参数 -->
    </keep-alive>
  </div>
</template>

<script>
  // import http from './assets/js/http'
  import {urlParse} from 'common/js/util'
  import header from 'components/header/header.vue'

  const ERR_OK = 0

  export default { // 默认返回
    data () { // 要明确是在dom加载结束之前还是之后，还是遇到关键字的时候就去匹配
      return {
        sellers: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () { // 这个函数的作用就是在dom结构没有渲染结束之前就会调用
      this.$http.get('/api/seller?id=' + this.sellers.id).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          /* this.sellers = response.data */
          this.sellers = Object.assign({}, this.sellers, response.data)
          console.log(this.sellers.id)
        }
      })
    },
    components: { // 组件注册
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import 'common/stylus/mixin'
/* eslint-disable */
 #app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
      a.router-link-active
          color: red
</style>
