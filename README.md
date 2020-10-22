A React Native APP 0.63.2

  # APP
> 调度平台

 ## Setup

  ``` bash
 # install dependencies
1. npm install
2. npx pod-install  ||  (cd ios & pod install)
3. node_modules/react-native-amap3d/lib/js/map-view/component.js Call native method 添加trycatch
https://github.com/qiuxiang/react-native-amap3d/issues/272

 # serve with hot
ios -> npm run ios
android -> npm run android

 # code standard
 npm run lint

  # build
android -> npm run bundle-android

 ```

  # 项目布局

  ```
 .
 ├── android                                     // 原生Android目录
 ├── ios                                         // 原生IOS目录
 ├── src                                         // 项目目录
 │   ├── components                              // 组件文件
 │   │   ├── Amap                                   // 高德地图组件          
 │   │   ├── CustomNotification                     // 自定义通知组件  
 │   │   ├── Header                                   
 │   │   ├── HiButton                                                                      
 │   │   └── ...                                  
 │   ├── language                                // 国际化
 │   ├── mock                                    // 模拟数据                              
 │   ├── page                                    // 页面
 │   │   └── ...
 │   ├── resource                                // 资源文件
 │   │   ├── imgs                                   // 图片资源
 │   │   ├── images                                 // 图片管理类           
 │   │   └── index.js                               // 引用
 │   ├── routes                                  // 路由
 │   │   └── ...
 │   ├── utils                                   // 工具文件
 │   │   ├── BizContext                             // 生命周期内数据存储
 │   │   ├── Device                                 // 设备判断
 │   │   ├── EventBus                               // 事件发布订阅       
 │   │   ├── HiforceCom                             // 组件实例
 │   │   ├── NotificationHandler                    // 通知
 │   │   ├── NotifServices                          // 通知服务
 │   │   ├── RequestUtil                            // 网络请求
 │   │   ├── RoutePlan                              // 第三方跳转                              
 │   │   ├── ScreenUtil                             // 屏幕工具类 
 │   │   └── ...                                                                     
 │   ├── App
 │   └── index.js                                
 .

 ```

  ## 第三方库

``` bash
# react-navigation 路由
# react-native-amap3d  高德地图
# react-native-amap-geolocation  高德定位
# react-native-push-notification 通知
# @react-native-community/push-notification-ios  通知(ios)
# react-native-root-toast  Toast提示
# @react-native-community/async-storage  storage数据持久化
# react-native-svg 
# react-native-svg-uri  执行npm run svg 打包src/resource/svg文件下的svg
# react-native-tab-view  TabView
# 
