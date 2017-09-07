// pages/collect/collect.js
//获取应用实例
var app = getApp()
Page({
  data: {
    yuLu: [],
    page: 2,
    payMoney: false, //打赏窗口
    payOther: false, //其他金额
    loadEnd:true,
    moreData:false
  },
  onLoad: function() {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  // 查看语录详情
  toDetail: function(ev) {
    var that = this;
    var oid = ev.target.dataset.oid;
    wx.navigateTo({
      url: '../LookYulu/LookYulu?oid=' + oid
    })
  },

  onShow: function() {
    var that = this;
    app.getUserInfo(function() {
      var sign = wx.getStorageSync('sign');
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/collection-list?sign=' + sign,
        method: 'GET',
        data: {
          page: 1
        },
        success: function(res) {
          console.log(res);
          var collectionList = res.data.data.collectionList;
          for (var i = 0; i < collectionList.length; i++) {
            collectionList[i].isCollect = 1;
          }
          that.setData({
            yuLu: collectionList
          });
          console.log(that.data);
        }
      })
    })
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
    var that = this;
    var pay_num = ev.target.dataset.moe;
    var oid = that.data.oid;
    var sign = wx.getStorageSync("sign");
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/reward-opus?sign=' + sign,
      data: {
        amount: 0.01,
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

  // 取消收藏
  hasCollect: function(ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/remove-collection?sign=' + sign,
      method: "GET",
      data: {
        oid: oid
      },
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 1000
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
        setTimeout(function(){
           var yuLu = that.data.yuLu;
           console.log(yuLu);
           console.log(oid);
           for (var i = 0; i < yuLu.length; i++) {
             if (yuLu[i].oid == oid) {
                yuLu.splice(i,1);
             }
           };
           console.log(yuLu);
           that.setData({
             yuLu: yuLu
           });
        },100);
      }
    })
  },


  // 页面触底事件
  pageBottom: function(ev) {
    var that = this;
    var page = that.data.page;
    var loadEnd = that.data.loadEnd;
    var moreData = that.data.moreData;
    wx.showLoading({
      title: '加载中'
    });
      var sign = wx.getStorageSync('sign');
      if (loadEnd) {
        that.setData({
          loadEnd: false
        });
        wx.request({
          url: 'https://yulufan.playonwechat.com/site/collection-list?sign=' + sign,
          method: 'GET',
          data: {
            page: page
          },
          success: function(res) {
            console.log(res);
            var collectionList = res.data.data.collectionList;
            var oldList = that.data.collectionList;
            setTimeout(function() {
              wx.hideLoading()
            }, 500);
            if (collectionList.length > 0) {
                 oldList = oldList.concat(collectionList),
                 page++;
            } else {
                oldList = oldList;
                moreData = true;
            }
            that.setData({
              page: page,
              yuLu:oldList,
              loadEnd: true,
              moreData:moreData
            });
          }
        })
      }

  }
})
