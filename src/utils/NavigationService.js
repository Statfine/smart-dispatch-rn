let _routers;
let _navigation;

function setNav(navigation) {
  _navigation = navigation;
}

/**
 * 设置当前路由栈和导航对象
 * @param routers
 * @param navigation
 */
function setRouters(routers, navigation) {
  _routers = routers;
}

/**
 * 跳转到指定页面
 * @param routeName
 * @param params
 */
function navigate(routeName, params = {}) {
  _navigation.current.navigate(routeName, params);
}
function push(routeName, params = {}) {
  _navigation.current.push(routeName, params);
}

/**
 * 返回到顶层
 */
function popToTop() {
  _navigation.current.popToTop();
}

/**
 * 返回
 */
function goBack() {
  _navigation.current.goBack();
}

/**
 * 返回到任意页面
 * @param routeName
 */
function popToRouter(routeName) {
  if (!routeName) {
    this.goBack();
    return;
  }
  _navigation.current(routeName);
}

export { setNav, setRouters, navigate, push, popToTop, goBack, popToRouter };
