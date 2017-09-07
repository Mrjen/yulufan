//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    yuLu: [],
    payMoney: false, //打赏窗口
    payOther: false, //其他金额
    hasLike: false, //是否已点赞
    page: 2, //当前显示页码
    oid: "",
    loadEnd: true,
    moreData: false, //控制页面底部，没有更多数据
    pageWorld: "", //当前页面显示哪个关键词内容 ：“最新”，“最火”
    pageMenu:[{
      inx:"0",
      category:2,
      text:"男神",
      margin_left:0
    },{
      inx:"1",
      category:3,
      text:"女神",
      margin_left:0
    },{
      inx:"2",
      category:1,
      text:"语录",
      margin_left:0
    }],
    swiperData:""
  },
  // 活动页面
  naviActive: function (e) {
    console.log(e)
    var src = e.currentTarget.dataset.src;
    var pid = e.currentTarget.dataset.pid;
    var is_activity = e.currentTarget.dataset.activity;

    if (is_activity) {
      wx.navigateTo({
        url: '../active/active?pid=' + pid,
      })
    } else {
      wx.navigateTo({
        url: '../swiperPage/swiperPage?src=' + src,
      })
    }
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
    console.log(that.data);
    console.log(sign, oid);
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
        console.log(res);
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

  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    app.getUserInfo(function() {
      var sign = wx.getStorageSync('sign');
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/get-opus-list?sign=' + sign,
        method: 'GET',
        data: {
          type: "hot"
        },
        success: function(res) {
          console.log("hot",res);
          var opusList = res.data.data.opusList;
          that.setData({
            yuLu: opusList,
            sign: sign
          });
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        }
      });
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/get-pictures?sign=' + sign,
        success:function(res){
          console.log(res);
          var swiperData = res.data.data.pictures;
          that.setData({
            swiperData:swiperData
          })
          console.log(that.data.swiperData);
        }
      })
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
    var oid = ev.target.dataset.oid;
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
  },


  onShow: function() {

  },

  // 查看语录详情
  toDetail: function(ev) {
    var that = this;
    var oid = ev.target.dataset.oid;
    wx.navigateTo({
      url: '../lookDetail/lookDetail?oid=' + oid + '&choose=0'
    })
  },

  // 获取最新内容
  getYuLu: function(ev) {
    var that = this;
    var category = ev.target.dataset.cate;
    wx.setStorageSync('category',category);
    wx.showLoading({
      title: '加载中',
    });
    var sign = wx.getStorageSync('sign');
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/get-opus-list?sign=' + sign,
      method: 'GET',
      data: {
        type: 'hot',
        category:category
      },
      success: function(res) {
        //console.log(res);
        wx.setStorageSync("type", "newest");
        var pageMenu = that.data.pageMenu;
        for (var i = 0; i < pageMenu.length; i++) {
             pageMenu[i].margin_left = 0;
           if (pageMenu[i].category == category) {
               pageMenu[i].margin_left = -20;
           }
        }
        var opusList = res.data.data.opusList;
        that.setData({
          yuLu: opusList,
          scrollTop: 1,
          page: 2,
          moreData: false,
          pageMenu:pageMenu
        });
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      }
    })
  },

  // 收藏
  collectBtn: function(ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
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

  // 页面触顶
pagesTop:function(ev){
    var that = this;
    console.log(ev);
    var loadEnd = that.data.loadEnd;
    var sign = wx.getStorageSync('sign');
    var category = wx.getStorageSync('category');
    if (loadEnd) {
      that.setData({
        loadEnd: false
      });
      wx.showLoading({
        title: '数据加载中',
      });
      var sign = wx.getStorageSync('sign');
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/get-opus-list?sign=' + sign,
        method: 'GET',
        data: {
          type: "hot",
          category:category
        },
        success: function(res) {
          //console.log(res);
          var opusList = res.data.data.opusList;
          that.setData({
            yuLu: opusList,
            loadEnd: true
          });
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        }
      })
    }
  },

  // 页面触底
  pageBottom: function() {
    var that = this;
    var page = that.data.page;
    var loadEnd = that.data.loadEnd;
    var sign = wx.getStorageSync('sign');
    var category = wx.getStorageSync('category');
    if (loadEnd) {
      that.setData({
        loadEnd: false
      });
      wx.showLoading({
        title: '数据加载中',
      });
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/get-opus-list?sign=' + sign,
        method: 'GET',
        data: {
          type:"hot",
          page: page,
          category:category
        },
        success: function(res) {
          console.log(res);
          var oldList = that.data.yuLu;
          var opusList = res.data.data.opusList;
          var moreData = that.data.moreData;
          setTimeout(function() {
            wx.hideLoading()
          }, 500);
          if (opusList.length > 0) {
            page++;
            opusList = oldList.concat(opusList);
            moreData = false;
          } else {
            opusList = oldList;
            moreData = true;
          };
          that.setData({
            page: page,
            yuLu: opusList,
            loadEnd: true,
            moreData: moreData
          })
        }
      })
    }



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})
