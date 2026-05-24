import { getToken } from "@/utils/auth";

// 登录页面
const homePage = "/pages/game/ingame/index";

// 页面白名单
const whiteList = ["/pages/game/ingame/index"];

// 检查地址白名单
function checkWhite(url) {
  const path = url.split("?")[0];
  return whiteList.indexOf(path) !== -1;
}

// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
list.forEach((item) => {
  uni.addInterceptor(item, {
    invoke(to) {
      if (getToken()) {
        if (to.url === homePage) {
          uni.reLaunch({ url: "/" });
        }
        return true;
      } else {
        if (checkWhite(to.url)) {
          return true;
        }
        uni.reLaunch({ url: homePage });
        return false;
      }
    },
    fail(err) {
      console.log(err);
    },
  });
});
