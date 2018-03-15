import 'assets/js/amap'
import api from '@/getdata/fetch'
import { hasClass } from 'assets/js/util'
import { MessageBox,Indicator } from 'mint-ui'
const ERR_OK = 0
// let shops = []
// api.myShops()
//   .then(res => {
//     if (res.data.code === ERR_OK) {
//       shops = res.data.result.data
//       console.log(shops)
//     }
//   })

export function initamap() {
  Indicator.open({
    text: '定位中...',
    spinnerType: 'triple-bounce'
  })
  var map = new AMap.Map('map', {
    resizeEnable: true,
    zoom: 15
    // center: that.center
  })
  // MessageBox.confirm('加载失败，重新加载？').then(action => {
  //   window.location.reload()
  // });
  // let map_el = document.getElementById('map')
  // console.log(map_el)
  // if(!hasClass(map_el,'amap-container')){
    // MessageBox.confirm('加载失败，重新加载？')
    // .then(action => {
    //   window.location.reload()
    // })
    // .catch(() => {
    //   return
    // })
  // }
  let markeroption = [] // 所有marker
  let markerlist = []   // 所有marker的实例
  AMap.plugin('AMap.Geolocation',
    function () {
      // toolBar = new AMap.ToolBar({locationMarker: customMarker})
      // map.addControl(toolBar)
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
        convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        // 显示定位按钮，默认：true
        buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
        // GeoLocationFirst: true,
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true     // 定位成功后将定位到的位置作为地图中心点，默认：true
        // zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      })
      map.addControl(geolocation)
      geolocation.getCurrentPosition()
      // console.log(geolocation.isSupported())  // 是否支持浏览器定位
      // geolocation.getCityInfo()  // 获取定位的城市信息
      AMap.event.addListener(geolocation, 'complete', onComplete)// 返回定位信息
      AMap.event.addListener(geolocation, 'error', onError)      //   返回定位出错信息
      // 定位成功的回调
      function onComplete(data) {
        // map.cleanOverlays()
        map.remove(markerlist)  // 每次定位都清空marker 防止重复
        // let arr = [
        //   data.position.getLng(),
        //   data.position.getLat()
        // ]
        // that.center = arr
        var lnglat = new AMap.LngLat(data.position.getLng(), data.position.getLat())
        // ((lnglat.distance(data[i].location.split(','))) / 1000).toFixed(2)
        // 定位成功后拿到坐标 请求接口
        let userid = window.localStorage.getItem('user_id')
        
        api.myShops()
          .then(res => {
            let data = res.data.result.data
            markerlist = []
            markeroption = [] // 每次定位都清空marker数组 防止重复

            for (let i = 0; i < data.length; i++) {
              let ob = {}
              ob.map = map
              ob.position = data[i].location.split(',')
              ob.offset = new AMap.Pixel(-100, -100)
              // console.log(((lnglat.distance(data[i].location.split(','))) / 1000).toFixed(2))
              ob.content = '<div class="marker-item">' +
                '<div class="marker-item-top" style="display:flex;align-items:center;width:190px;height:3rem;background-image: linear-gradient(-127deg, #795CDC 0%, #EC3F77 100%);box-shadow: 0 2px 6px 0 rgba(0,0,0,0.50);border-radius: 100px;">' +
                '<dl style="display:flex;align-items:center;">' +
                '<dt class="marker-item-img" style="margin-left:5px;width:50px;height:50px;border-radius:50%;">' +
                '<img style="height:100%;width:100%;border-radius:50%;" src="' + data[i].img + '" alt=""/>' +
                '</dt>' +
                '<dd class="marker-item-info" style="flex:1;padding-left:10px;">' +
                '<p style="font-size:14px;color:#fff;">' + data[i].shopname + '</p>' +
                '<p style="font-size:10px;color: #D8B6DE;margin-top:5px;">' + ((lnglat.distance(data[i].location.split(','))) / 1000).toFixed(2) + 'KM</p>' +
                '</dd>' +
                '</dl>' +
                '</div>' +
                '<div class="marker-item-bottom" style="width:25px;height:38px;margin:0 auto;margin-top:0.05rem;">' +
                '<img style="height:100%;width:100%" src="http://ot2pd6835.bkt.clouddn.com/position@2x.png" alt=""/>' +
                '</div>' +
                '</div>'
              markeroption.push(ob)
            }
            for (var i = 0, len = markeroption.length; i < len; i++) {
              let app = new AMap.Marker(markeroption[i])
              markerlist.push(app)
            }
            // console.log(markeroption.length)
            // console.log(markerlist.length)
            for (let i = 0; i < data.length; i++) {
              markerlist[i].on('click', function () {
                // console.log(window.location.href)
                window.location.href = window.location.origin + `/bee/#/store?shop_id=${data[i].id}`
                // that.$router.push({ path: '/store', query: { shop_id: data[i].id } })
                window.localStorage.setItem('shopid', data[i].id)
              })
            }
            Indicator.close()
            let el = document.getElementsByClassName('amap-maps')
            if(!el[0]){
              window.location.reload()
              // MessageBox.confirm('加载失败，重新加载？')
              //   .then(action => {
              //     window.location.reload()
              //   })
              //   .catch(() => {
              //     return
              //   })
            }
          })
      }
      // 定位错误的回调
      function onError(data) {
        Indicator.close()
        switch (data.info) {
          case 'PERMISSION_DENIED':
            console.log('浏览器阻止了定位操作')
            Toast('浏览器阻止了定位操作')
            break
          case 'POSITION_UNAVAILBLE':
            console.log('无法获得当前位置')
            Toast('无法获得当前位置')
            break
          case 'TIMEOUT':
            console.log('定位超时')
            Toast('定位超时')
            break
          default:
            console.log('未知错误')
            Toast('未知错误')
            break
        }
      }
    })
}
