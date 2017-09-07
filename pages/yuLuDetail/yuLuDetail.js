// pages/yuLuDetail/yuLuDetail.js
var common = require('../../utils/commonjs.js');
var app = getApp();
Page({
// 页面的初始数据
  data: {
    payMoney: false, //打赏窗口
    payOther: false, //其他金额
  },

  // 打赏
  payMoney: function(ev) {
    var that = this;
    var oid = ev.target.dataset.oid;
    console.log(oid);
    that.setData({
      payMoney: true,
      oid: oid
    })
  },

  // 打赏
  payNum: function(ev) {
    //console.log(ev);
    var that = this;
    var pay_num = ev.target.dataset.moe;
    var oid = that.data.oid;
    var sign = wx.getStorageSync("sign");
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");
    if (nickName&&avatarUrl) {
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/reward-opus?sign=' + sign,
        data: {
          amount: pay_num,
          oid: oid
        },
        success: function(res) {
          console.log(res);
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function(res) {
              console.log(res);
              that.setData({
                payMoney: false
              });
              wx.showToast({
                title: '感谢您的打赏，我会努力做出更好的作品',
                icon: 'success',
                duration: 1000
              })
            },
            'fail': function(res) {
              console.log(res);
            }
          })
        }
      })
    }else {
       common.getUser();
    }
  },

  // 获取其他金额
  otherMoneyNum: function(ev) {
    //console.log(ev);
    var that = this;
    var other_money_num = ev.detail.value;
    that.setData({
      other_money_num: other_money_num
    })
  },

  // 打赏其他金额
  payOtherMoney: function(ev) {
    console.log(ev);
    var that = this;
    var oid = that.data.oid;
    var sign = wx.getStorageSync("sign");
    var other_money_num = that.data.other_money_num;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/reward-opus?sign=' + sign,
      data: {
        amount: other_money_num,
        oid: oid
      },
      success: function(res) {
        //console.log(res);
        if (res.data.status) {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function(res) {
              console.log(res);
                that.setData({
                  payMoney: false,
                  payOther: false
                });
                wx.showToast({
                  title: '感谢您的打赏，我会努力做出更好的作品',
                  icon: 'success',
                  duration: 1000
                })
            },
            'fail': function(res) {
              console.log(res);
            }
          })
        }else {
          wx.showToast({
            title:res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  // 关闭打赏弹窗
  colseMoneyWin: function() {
    var that = this;
    that.setData({
      payMoney: false
    })
  },

  // 打开其他金额
  openOther: function() {
    var that = this;
    that.setData({
      payOther: true
    })
  },

  // 关闭其他金额
  colseOther: function(ev) {
    var that = this;
    that.setData({
      payOther: false
    })
  },



// 生命周期函数--监听页面加载
  onLoad: function (options) {
     console.log("转发页面参数",options);
     console.log(options.sharecode);
     var that = this;
     that.setData({
       oid:options.oid
     })
  },

  // 取消点赞作品
  likeYuLu: function(ev) {
    //console.log(ev);
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/remove-opus-zan?sign=' + that.data.sign,
      method: "GET",
      data: {
        oid: oid
      },
      success: function(res) {
        var yuLu = that.data.yuLu;
        for (var i = 0; i < yuLu.length; i++) {
          if (yuLu[i].oid == oid) {
            yuLu[i].isZan = !yuLu[i].isZan;
            yuLu[i].thumb = parseInt(yuLu[i].thumb) - 1;
          }
        };
        that.setData({
          yuLu: yuLu
        });
      }
    })
  },

  // 点赞作品
  unLikeYuLu: function(ev) {
    //console.log(ev);
    var that = this;
    var sign = wx.getStorageSync('sign');
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");
    var oid = ev.target.dataset.oid;
    if (nickName&&avatarUrl) {
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/save-opus-zan?sign=' + that.data.sign,
        method: "GET",
        data: {
          oid: oid
        },
        success: function(res) {
          var yuLu = that.data.yuLu;
          for (var i = 0; i < yuLu.length; i++) {
            if (yuLu[i].oid == oid) {
              yuLu[i].isZan = !yuLu[i].isZan;
              yuLu[i].thumb = parseInt(yuLu[i].thumb) + 1;
            }
          };
          that.setData({
            yuLu: yuLu
          });
        }
      })
    }else {
      common.getUser();
    }

  },

  // 收藏
  collectBtn: function(ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");
    if (nickName&&avatarUrl) {
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/collect-opus?sign=' + that.data.sign,
        method: "GET",
        data: {
          oid: oid
        },
        success: function(res) {
          //console.log(res);
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 500
          });
          var yuLu = that.data.yuLu;
          for (var i = 0; i < yuLu.length; i++) {
            if (yuLu[i].oid == oid) {
              yuLu[i].isCollect = !yuLu[i].isCollect;
            }
          };
          that.setData({
            yuLu: yuLu
          });
        }
      })
    }else {
      common.getUser();
    }

  },

  // 取消收藏
  hasCollect: function(ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/remove-collection?sign=' + that.data.sign,
      method: "GET",
      data: {
        oid: oid
      },
      success: function(res) {
        //console.log(res);
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 500
        });
        var yuLu = that.data.yuLu;
        for (var i = 0; i < yuLu.length; i++) {
          if (yuLu[i].oid == oid) {
            yuLu[i].isCollect = !yuLu[i].isCollect;
          }
        };
        that.setData({
          yuLu: yuLu
        });
      }
    })
  },


    // 下载
    downLoad: function(ev) {
      var that = this;
      var oid = ev.target.dataset.oid;
      var nickName = wx.getStorageSync("nickName");
      var avatarUrl = wx.getStorageSync("avatarUrl");
      if (nickName && nickName) {
        wx.navigateTo({
          url: "../downLoad/downLoad?oid=" + oid
        })
      } else {
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
              url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + app.data.sign,
              method: 'POST',
              data: {
                info: userData
              },
              success: function(res) {
                //console.log("用户信息保存成功",res);
                wx.setStorageSync('avatarUrl', avatarUrl);
                wx.setStorageSync('nickName', nickName);
                var persion_info = that.persion_info;
                that.setData({
                  userInfo: [userInfo]
                });
                app.globalData.userInfo = userInfo;
              }
            })
          },
          fail: function() {
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
                            console.log("用户信息", res);
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
                              url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + app.data.sign,
                              method: 'POST',
                              data: {
                                info: userData
                              },
                              success: function(res) {
                                console.log("用户信息保存成功", res);
                                wx.setStorageSync('avatarUrl', avatarUrl);
                                wx.setStorageSync('nickName', nickName);
                                that.setData({
                                  userInfo: [userInfo]
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
      }
    },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

// 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");
      app.getUserInfo(function(){
        var sign = wx.getStorageSync('sign');
        console.log(sign);
        var oid = that.data.oid;
        console.log(oid);
        wx.request({
          url:'https://yulufan.playonwechat.com/site/get-opus-detail?sign=' + sign ,
          data:{
            oid:oid
          },
          success:function(res){
            console.log(res);
            var yuLu = res.data.data.opus;
            that.setData({
              yuLu:[yuLu]
            })
          }
        })
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
onShareAppMessage: function (res) {
}
})
