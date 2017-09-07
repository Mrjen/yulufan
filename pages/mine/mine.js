// pages/mine/mine.js
var app = getApp();
Page({
// 页面的初始数据
  data: {
    persion_info:[{
      persionImg:"https://yulufan.playonwechat.com/static/img/home_persion.png",
      persionName:"Longnon",
      persionWorks:256,
      persionInput:2345,
      persionCollect:345,
      persionNotice:3
    }],
    userInfo: [{
      'userImg': '',
      'userName': '',
      'userTag': ''
    }],
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getUserInfo(function(){
      var sign = wx.getStorageSync('sign');
        wx.request({
          url:'https://yulufan.playonwechat.com/site/get-userinfo?sign='+ sign,
          method:'GET',
          success:function(res){
            console.log(res);
            var persion_info = res.data.data.userinfo[0];
            var userData = {};
            if (!app.globalData.userInfo) {
              app.globalData.userInfo = {};
              app.globalData.userInfo.nickName = persion_info.wx_name;
              app.globalData.userInfo.avatarUrl = persion_info.avatarurl;
              console.log(app.globalData);
              wx.setStorageSync('nickName', persion_info.wx_name);
              wx.setStorageSync('avatarUrl', persion_info.avatarurl);
            }
            var userInfo = [{
              nickName:persion_info.wx_name,
              avatarUrl:persion_info.avatarurl
            }]
            that.setData({
              persion_info:[persion_info],
              userInfo:userInfo
            })
          }
        })

    })
  },

  upWorks:function(){
     var that = this;
     var userInfo = that.data.userInfo[0].avatarUrl;
     if (userInfo) {
       wx.navigateTo({
         url: '../writeYulu/writeYulu'
       })
     }else {
       wx.showModal({
         title: '提示',
         content: '您还没有登录，登录后才能上传作品哦！',
         showCancel:false,
         success: function(res) {
           if (res.confirm) {
             console.log('用户点击确定')
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
        })
     }
  },

  toAuth: function() {
  var that = this;
  wx.getUserInfo({
    success: function(res) {
      var userInfo = res.userInfo;
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      var gender = userInfo.gender; //性别 0：未知、1：男、2：女
      var province = userInfo.province;
      var city = userInfo.city;
      var country = userInfo.country;
      var userData = {
        wx_name: nickName,
        avatarUrl: avatarUrl,
        gender: gender,
        province: province,
        city: city,
        country: country
      };
      wx.request({
        url:'https://yulufan.playonwechat.com/site/save-user-info?sign='+app.data.sign,
        method:'POST',
        data:{
          info:userData
        },
        success:function(res){
          //console.log("用户信息保存成功",res);
          wx.setStorageSync('avatarUrl', avatarUrl);
          wx.setStorageSync('nickName', nickName);
          var persion_info = that.persion_info;
          that.setData({
            userInfo:[userInfo]
          });
          app.globalData.userInfo = userInfo;
        }
      })
    },
    fail:function(){
       console.log("获取授权失败");
       wx.showModal({
          title: '提示',
          content: '系统检测您没打开语录范的用户信息权限，是否去设置打开？',
          success: function(res) {
            if (res.confirm) {
              wx.openSetting({
                    success: (res) => {
                      console.log(res);
                      if (res.authSetting['scope.userInfo']) {
                          console.log("用户授权成功");
                          wx.getUserInfo({
                            success: function(res) {
                             console.log("用户信息",res);
                              var userInfo = res.userInfo;
                              var nickName = userInfo.nickName;
                              var avatarUrl = userInfo.avatarUrl;
                              var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                              var province = userInfo.province;
                              var city = userInfo.city;
                              var country = userInfo.country;
                             var userData = {
                               wx_name: nickName,
                               avatarUrl: avatarUrl,
                               gender: gender,
                               province: province,
                               city: city,
                               country: country
                             };
                             wx.request({
                               url:'https://yulufan.playonwechat.com/site/save-user-info?sign='+app.data.sign,
                               method:'POST',
                               data:{
                                 info:userData
                               },
                               success:function(res){
                                  console.log("用户信息保存成功",res);
                                 wx.setStorageSync('avatarUrl', avatarUrl);
                                 wx.setStorageSync('nickName', nickName);
                                 that.setData({
                                    userInfo:[userInfo]
                                 });
                                 app.globalData.userInfo = userInfo;
                               }
                             })
                            }
                          })
                      }
                    }
                  })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
    }
  })
},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
