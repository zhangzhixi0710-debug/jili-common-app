<script>
import config from './config'
import { getToken } from '@/utils/auth'
import { isGameRouteUrl, normalizeCurrentH5GameRoute } from '@/utils/business-router'

export default {
  onLaunch: function () {
    this.initApp()
  },
  methods: {
    // 初始化应用
    initApp() {
      // 初始化应用配置
      this.initConfig()
      // 检查用户登录状态
      //#ifdef H5
      this.checkLogin()
      //#endif
    },
    initConfig() {
      this.globalData.config = config
    },
    checkLogin() {
      //#ifdef H5
      const gameUrl = normalizeCurrentH5GameRoute()
      if (gameUrl) {
        uni.reLaunch({ url: gameUrl })
        return
      }
      if (typeof window !== 'undefined' && isGameRouteUrl(window.location.href)) {
        return
      }
      //#endif
      if (!getToken()) {
        this.$tab.reLaunch('/pages/login')
      }
    }
  }
}
</script>

<style lang="scss">
@use '@dcloudio/uni-ui/lib/uni-scss/index.scss' as uniUiStyles;
@use '@/static/scss/index.scss' as appStyles;

/* #ifdef H5 */
html,
body,
uni-page-body {
  width: 100%;
  // min-height: 100% !important;
  height: 100vh;
  margin: 0;
  background: #14142b;
}

uni-input.search-input,
uni-input.search-input .uni-input-wrapper,
uni-input.search-input input {
  width: 100% !important;
  height: 40px !important;
  min-height: 40px !important;
  line-height: 40px !important;
  box-sizing: border-box !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: #24263a !important;
  color: #fff !important;
  font-size: 20px !important;
}

uni-input.search-input .input-placeholder,
uni-input.search-input .uni-input-placeholder {
  color: #fff !important;
  font-size: 20px !important;
  line-height: 40px !important;
  z-index: 1;
}

uni-view.content {
  width: calc(100% - 20px) !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
}

uni-view.footer-data {
  padding: 0 16px !important;
  box-sizing: border-box !important;
}

/* #endif */
</style>
