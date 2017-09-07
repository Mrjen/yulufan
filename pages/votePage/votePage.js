// pages/votePage/votePage.js
var commonjs = require("../../utils/commonjs.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toActive: function(){
    var pid = this.data.matchOpus.pid;
    wx.navigateTo({
      url: '../activityDetail/activityDetail?pid=' + pid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var oid = options.oid;
    // oid = 429;
    var sign = wx.getStorageSync("sign");

    that.setData({
      oid: oid
    })
 
    // 参赛作品
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/vote?sign=' + sign,
      data: {
        oid: oid
      },
      success: function (res) {
        console.log("投票", res);
        var matchOpus = res.data.data;
        that.setData({
          matchOpus: matchOpus
        });

        // 活动信息
        wx.request({
          url: 'https://yulufan.playonwechat.com/site/get-activity-info?sign=' + sign,
          data: {
            pid: matchOpus.pid
          },
          success: function (res) {
            console.log("活动", res);
            var active = res.data.data;
            that.setData({
              active: active
            })
          }
        })
      }
    })


    
  },
  // 取消点赞作品
  likeYuLu: function (ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/remove-opus-zan?sign=' + sign,
      method: "GET",
      data: {
        oid: oid
      },
      success: function (res) {
        var matchOpus = that.data.matchOpus;
        matchOpus.isZan = !matchOpus.isZan;
        matchOpus.thumb = parseInt(matchOpus.thumb) - 1;
        that.setData({
          matchOpus: matchOpus
        });
      }
    })
  },

  // 点赞作品
  unLikeYuLu: function (ev) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var oid = ev.target.dataset.oid;
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/save-opus-zan?sign=' + sign,
      method: "GET",
      data: {
        oid: oid
      },
      success: function (res) {
        var matchOpus = that.data.matchOpus;
        matchOpus.isZan = !matchOpus.isZan;
        matchOpus.thumb = parseInt(matchOpus.thumb) + 1;
        that.setData({
          matchOpus: matchOpus
        });
      }
    })
  },
  // 投票
  vote:function(){
    var that = this;
   var sign = wx.getStorageSync("sign");
   var oid = that.data.oid;
   var active = that.data.active;
   var nickName = wx.getStorageSync("nickName");
   var avatarUrl = wx.getStorageSync("avatarUrl");

   if(nickName && avatarUrl){
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/save-vote?sign=' + sign,
      data: {
        oid: oid
      },
      success: function (res) {
        console.log("投票", res);
        var msg = res.data.msg;
        var status = res.data.status;
        if (status) {
          active.is_vote = true;
          that.setData({
            active: active
          })
          wx.showToast({
            title: '投票成功'
          })
        } else {
          wx.showToast({
            title: msg
          })
        }
      }
    })
   }else{
     commonjs.getUser();
   }
   
  },
  joinActive:function(){
    var pid = this.data.matchOpus.pid;
    wx.navigateTo({
      url: '../active/active?pid=' + pid,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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