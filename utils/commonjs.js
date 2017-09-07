// pages/commonjs/commonjs.js
function getUser(){
  var wx_name = wx.getStorageSync('wx_name');
  var avatarUrl = wx.getStorageSync('avatarUrl');
   if (!wx_name&&!avatarUrl) {
     wx.login({
       success:function(res){
         if (res.code) {
           wx.request({
            url: 'https://yulufan.playonwechat.com/site/auth',
            data: {
              code: res.code
            },
            success:function(res){
              var sign = res.data.data.sign;
              wx.setStorageSync('sign', res.data.data.sign);
              wx.setStorageSync('mid', res.data.data.mid);
              wx.setStorageSync('sharecode', res.data.data.sharecode);
              wx.getUserInfo({
                 success:function(res){
                    var userData = {};
                    var userInfo = res.userInfo;
                    var wx_name = userInfo.nickName;
                    var avatarUrl = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    userData = {
                      wx_name: wx_name,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.setStorageSync('nickName', wx_name);
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.request({
                      url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + sign,
                      method: "POST",
                      data: {
                        info: userData
                      },
                      success:function(res){
                         console.log("保存用户信息");
                      }
                    })
                 },
                 fail:function() {
                   wx.showModal({
                     title:'提示',
                     confirmText:'前往授权',
                     content:'拒绝授权您无法使用打赏点赞功能',
                     success:function(res){
                       if (res.confirm) {
                         wx.openSetting({
                           success:(res) =>{
                             wx.getUserInfo({
                               success:function(res){
                                 var userData = {};
                                 var userInfo = res.userInfo;
                                 var wx_name = userInfo.nickName;
                                 var avatarUrl = userInfo.avatarUrl;
                                 var gender = userInfo.gender;
                                 var province = userInfo.province;
                                 var city = userInfo.city;
                                 var country = userInfo.country;
                                 userData = {
                                   wx_name: wx_name,
                                   avatarUrl: avatarUrl,
                                   gender: gender,
                                   province: province,
                                   city: city,
                                   country: country
                                 };
                                 wx.request({
                                   url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + sign,
                                   method: "POST",
                                   data: {
                                     info: userData
                                   },
                                   success:function(res){
                                      console.log("保存用户信息");
                                   }
                                 })
                               }
                             })
                           }
                         })
                       }else if (res.cancel) {
                         wx.showToast({
                            title: '用户授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                       }
                     }
                   })
                 }
              })
            }
          })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        //  }
       }
     })
   }
};
module.exports.getUser = getUser;
