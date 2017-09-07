// pages/LookYulu/LookYulu.js
var app = getApp()
Page({
// 页面的初始数据-
  data: {
     yuLu:[{
       imgSrc:"https://yulufan.playonwechat.com/static/img/home_yulu.png",
       yuLuText:"这是一段语录这是一段语录这是一段语录这是一段语录这是一段语录这是一段语录",
       persionImg:"https://yulufan.playonwechat.com/static/img/home_persion.png",
       persionName:"我是名字",
       yuluTime:"35分钟前",
       likeNum:"2333",
       likeStatic:1,
       collecStatic:1
     }],
     checkedAuth: false,
     checkedData: false,
     checkedCode: false
  },

// 复制语录文字
  copyBtn:function(){
    var that = this;
    var _text = that.data.yuLu[0].content;
    wx.setClipboardData({
        data: _text,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              //console.log(res.data)
              wx.showToast({
                title: '语录复制成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      })
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options);
    var avatarUrl = wx.getStorageSync("avatarUrl");
    var that = this;
    that.setData({
      oid:options.oid,
      avatarUrl: avatarUrl
    })
  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

// 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    app.getUserInfo(function(){
      wx.showLoading({
        title: '加载中',
      })
      var oid = that.data.oid;
      var wx_name = wx.getStorageSync('nickName');
      var sign = wx.getStorageSync('sign');
      wx.request({
        url:'https://yulufan.playonwechat.com/site/get-opus-detail?sign='+ sign,
        method:"GET",
        data:{
          oid:oid
        },
        success:function(res){
          console.log("二维",res);
          var yulu = res.data.data.opus;
          var _img = res.data.data.opus.picture;
          var _scale = new Number();
          var _imgHeight = new Number();
          var _lineHeight = new Number();
          wx.getImageInfo({
            src: _img,
            success: function (res) {
              console.log(res.width)
              console.log(res.height)

                _scale = res.height*676/res.width;
                _imgHeight = parseInt(_scale);
                _lineHeight = _imgHeight+60
              that.setData({
                yuLu:yulu,
                wx_name:wx_name,
                imgHeight:_imgHeight,
                lineHeight:_lineHeight
              });
              console.log(that.data);
            }
          })

          wx.hideLoading();
        }
      })
    })
  },

  // 下载海报
  downLoad:function(){
      var that = this;
      var oid = that.data.oid;
      var checkedAuth = that.data.checkedAuth;
      var checkedData = that.data.checkedData;
      var checkedCode = that.data.checkedCode;
      if (checkedAuth) {
        checkedAuth = 1;
      } else {
        checkedAuth = 0;
      };
      if (checkedData) {
        checkedData = 1;
      }else{
        checkedData = 0;
      }
      if (checkedCode) {
        checkedCode = 1;
      } else {
        checkedCode = 0;
      }
      wx.showLoading({
        title: '海报下载中请稍后',
      })
        var sign = wx.getStorageSync('sign');
        wx.request({
          url:'https://yulufan.playonwechat.com/site/download-opus?sign='+ sign,
          method:"GET",
          data:{
            type: checkedAuth,
            oid: oid,
            date:checkedData,
            qrcode: checkedCode
          },
          success:function(res){
            console.log(res);
            var url = res.data.data.url;
            wx.downloadFile({
             url: url, //仅为示例，并非真实的资源
             success: function(res) {
               console.log(res);
                wx.saveImageToPhotosAlbum({
                  filePath:res.tempFilePath,
                  success(res) {
                    console.log(res);
                    setTimeout(function(){
                      wx.hideLoading()
                    },0)
                    wx.showToast({
                      title: '海报下载成功，请去相册查看',
                      icon: 'success',
                      duration: 800
                    })
                 },
                 fail:function(){
                   setTimeout(function(){
                     wx.hideLoading()
                   },0);
                   wx.getSetting({
                      success(res) {
                         console.log(res);
                         if (!res.authSetting['scope.writePhotosAlbum']) {
                            console.log("用户拒绝保存");
                            wx.showModal({
                               title: '提示',
                               content: '系统检测到您没有同意语录范保存图片到相册，是否打开设置',
                               success: function(res) {
                                 if (res.confirm) {
                                   wx.openSetting({
                                     success:(res)=>{
                                       console.log(res);
                                     }
                                   })
                                 } else if (res.cancel) {
                                   console.log('用户点击取消')
                                 }
                               }
                             })
                         }
                      }
                   })
                 }
                })
             }
            })
          }
        })
    },

downLoadImg:function(){
   var that = this;
   var _src = that.data.yuLu[0].picture;
   wx.downloadFile({
     url:_src,
     success(res){
       console.log(res);
        wx.saveImageToPhotosAlbum({
            filePath:res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '海报下载成功，请去相册查看',
                icon: 'success',
                duration: 1000
              })
            },
            fail(res){
              wx.getSetting({
                 success(res) {
                    console.log(res);
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                       console.log("用户拒绝保存");
                       wx.showModal({
                          title: '提示',
                          content: '系统检测到您没有同意语录范保存图片到相册，是否打开设置',
                          success: function(res) {
                            if (res.confirm) {
                              wx.openSetting({
                                success:(res)=>{
                                  console.log(res);
                                }
                              })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                    }
                 }
              })
            }
        })
     }
   })
},

// 是否显示作者信息
checkedAuth: function(ev) {
  var that = this;
  var checkedAuth = that.data.checkedAuth;
  console.log();
  that.setData({
    checkedAuth: !checkedAuth
  })
},

//是否显示小程序码
checkedCode:function(){
  var that = this;
  var checkedCode = that.data.checkedCode;
  var lineHeight = that.data.lineHeight;
  if (checkedCode){
    that.setData({
      checkedCode: false,
      lineHeight:lineHeight-274
    })
  }else{
    wx.showModal({
      title: '温馨提示',
      content: '你的朋友通过长按识别小程序码可直接进入该语录页面，进行浏览，点赞，打赏哟',
      success: function (res) {

        if (res.confirm) {
          console.log(lineHeight);
          that.setData({
            checkedCode: true,
            lineHeight:lineHeight+274
          });
          console.log(that.data);
        } else {
          that.setData({
            checkedCode: false,
            lineHeight:lineHeight-274
          })
        }
      }
    })
  }

},

// 是否显示时间
checkedData: function(ev) {
  var that = this;
  var myDate = new Date();
  myDate = myDate.getTime();

  function time(unixtime, withTime) {
    if (!unixtime) {
      unixtime = (new Date()).getTime();
    } else {
      unixtime *= 1000;
    }
    var nd = new Date(unixtime),
      year = nd.getFullYear(),
      month = nd.getMonth() + 1,
      day = nd.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (!withTime) {
      return year + '-' + month + '-' + day;
    }
    var hour = nd.getHours(),
      minute = nd.getMinutes(),
      second = nd.getSeconds();
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
  };
  var this_time = time(myDate / 1000);
  this_time = this_time.split("-").join("/");
  var checkedData = that.data.checkedData;
  that.setData({
    checkedData: !checkedData,
    thisTime: this_time
  })
},


// 生命周期函数--监听页面隐藏
  onHide: function () {

  },

// 生命周期函数--监听页面卸载
  onUnload: function () {

  },

// 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

// 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

// 用户点击右上角分享
  onShareAppMessage: function () {

  }
})
