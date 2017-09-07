//app.js
var aldstat = require("./utils/ald-stat.js"); 
App({
  data: [{
    sign: "",
  }],
  loginCallbacks: [],
  loginProcessing: false,

  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // let nickName = this.globalData.nickName;
    // console.log(this.globalData);
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.sign) {
      typeof cb == 'function' && cb(this.globalData.sign);
    } else {
      //调用登录接口
      cb && this.loginCallbacks.push(cb);
      if (this.loginProcessing == true) {
        return;
      };
      this.loginProcessing = true;
      wx.login({
        success: function(res) {
          //console.log(res);
          if (res.code) {
            wx.request({
              url: 'https://yulufan.playonwechat.com/site/auth',
              data: {
                code: res.code
              },
              success: function(res) {
                console.log(res);
                that.data.sign = res.data.data.sign;
                that.data.mid = res.data.data.mid;
                that.globalData.sign = res.data.data.sign;
                //console.log(that.globalData);
                wx.setStorageSync('sign', res.data.data.sign);
                wx.setStorageSync('mid', res.data.data.mid);
                wx.setStorageSync('sharecode', res.data.data.sharecode);
                typeof cb == "function" && cb(that.globalData.sign);
                var nickName = wx.getStorageSync("nickName");
                var avatarUrl = wx.getStorageSync("avatarUrl");
                  if (nickName&&avatarUrl) {
                    var userInfo = {
                      nickName:nickName,
                      avatarUrl:avatarUrl
                    }
                    that.globalData.userInfo = userInfo;
                  }

                // wx.getUserInfo({
                //   complete: function() {
                //     that.loginProcessing = false;
                //   },
                //   success: function(res) {
                //     console.log("用户信息", res);
                //     var userData = {};
                //     var userInfo = res.userInfo
                //     var wx_name = userInfo.nickName
                //     var avatarUrl = userInfo.avatarUrl
                //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
                //     var province = userInfo.province
                //     var city = userInfo.city
                //     var country = userInfo.country
                //     userData = {
                //       wx_name: wx_name,
                //       avatarUrl: avatarUrl,
                //       gender: gender,
                //       province: province,
                //       city: city,
                //       country: country
                //     }
                //     wx.setStorageSync('wx_name', wx_name);
                //     wx.setStorageSync('avatarUrl', avatarUrl);
                //     wx.request({
                //       url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + that.data.sign,
                //       method: "POST",
                //       data: {
                //         info: userData
                //       },
                //       success: function(res) {
                //         console.log("保存用户信息", res);
                //       }
                //     });
                //     while (that.loginCallbacks.length > 0) {
                //       var cb = that.loginCallbacks.shift();
                //       typeof cb == "function" && cb(that.globalData.userInfo);
                //     }
                //     that.globalData.userInfo = res.userInfo
                //
                //   },
                //   fail: function() {
                //     console.log("用户拒绝授权");
                //     while (that.loginCallbacks.length > 0) {
                //       console.log(cb)
                //       var cb = that.loginCallbacks.shift();
                //       typeof cb == 'function' && cb(null);
                //     }
                //     wx.showModal({
                //       title: '提示',
                //       confirmText: '前往授权',
                //       content: '拒绝授权您将无法正常使用小程序',
                //       success: function(res) {
                //         if (res.confirm) {
                //           wx.openSetting({
                //             success: (res) => {
                //               wx.getUserInfo({
                //                 success: function(res) {
                //                   var userData = {};
                //                   var userInfo = res.userInfo;
                //                   var nickName = userInfo.nickName;
                //                   var avatarUrl = userInfo.avatarUrl;
                //                   var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                //                   var province = userInfo.province;
                //                   var city = userInfo.city;
                //                   var country = userInfo.country;
                //                   // 将用户名、头像储存到本地缓存中
                //                   wx.setStorageSync('avatarUrl', avatarUrl);
                //                   wx.setStorageSync('nickName', nickName);
                //                   that.data.username = nickName;
                //                   that.data.avatarUrl = avatarUrl;
                //                   userData = {
                //                     nickName: nickName,
                //                     avatarUrl: avatarUrl,
                //                     gender: gender,
                //                     province: province,
                //                     city: city,
                //                     country: country
                //                   };
                //                   console.log(userData);
                //                   that.globalData.userInfo = userData;
                //                   // 将用户的信息通过POST的方式推送到服务器储存
                //                   wx.request({
                //                     url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + that.data.sign,
                //                     method: 'POST',
                //                     data: {
                //                       info: userData
                //                     },
                //                     success: function(res) {
                //                       console.log("信息推送成功");
                //                     }
                //                   });
                //                 }
                //               })
                //             }
                //           })
                //         } else if (res.cancel) {
                //           wx.openSetting({
                //             success: (res) => {
                //               console.log(res);
                //             }
                //           })
                //         }
                //       }
                //     })
                //   }
                // })
              },
            })
          }else {
            console.log('获取用户登录态失败', + res.errMsg);
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
