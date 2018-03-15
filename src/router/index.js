import Vue from 'vue'
import Router from 'vue-router'

import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

Vue.use(Router)

/**
 *  router路由，作用类似于地址转发，目前有两种形式，说明如下
 * 第一种：
 *  redirect:将path指定的路径转发到redirect指定的路径
 * 第二种：
 *  component：将path指定的路径转发到component对应的组件中去，也就是跳转到component对应的组件页面
 */

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
})
