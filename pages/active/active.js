// pages/activity/activity.js
var commonjs = require("../../utils/commonjs.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    join: "未参赛",
    currentTab: 1,
    page: 2,
    loadEnd: true
  },
  // 参赛，去上传作品
  join_active:function(){
    var pid = this.data.pid;
    wx.navigateTo({
      url: '../writeNewYulu/writeNewYulu?pid=' + pid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var src = options.src;
    var pid = options.pid;
    var sign = wx.getStorageSync("sign");
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");

    this.setData({
      src: src,
      pid: pid,
      nickName: nickName,
      avatarUrl: avatarUrl
    })
    wx.hideShareMenu({});

    // 排行榜列表
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/get-match-opus-list?sign=' + sign,
      data: {
        pid: pid,
        page: 1,
        limit: 10
      },
      success:function(res){
        console.log("排行榜",res);
        var opusList = res.data.data.opusList;
        that.setData({
          opusList: opusList
        })
      }
    })

    // 自己的参赛作品
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/my-match-opus?sign=' + sign,
      data: {
        pid: pid
      },
      success: function (res) {
        console.log("参赛", res);
        var matchOpus = res.data.data;
        that. setData({
          matchOpus: matchOpus
        });
      }
    })

    // 活动信息
    wx.request({
      url: 'https://yulufan.playonwechat.com/site/get-activity-info?sign=' + sign,
      data: {
        pid: pid
      },
      success:function(res){
        console.log("活动",res);
        var active = res.data.data;
        that.setData({
          active: active
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // tab切换
  changeCurrent: function(e){
    var current = e.target.dataset.current;
    this.setData({
      currentTab: current
    })
  },
  // 去活动规则
  toRule: function(){
    var pid = this.data.pid;
    var avatarUrl = wx.getStorageSync("avatarUrl");
    console.log("头像",avatarUrl);
    if (avatarUrl){
      wx.navigateTo({
        url: '../activityDetail/activityDetail?pid=' + pid,
      })
    }else{
      commonjs.getUser();
    }
    
    
  },
  // 投票
  vote: function (e) {
    var that = this;
    var sign = wx.getStorageSync("sign");
    var oid = e.currentTarget.dataset.oid;

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
          var opusList = that.data.opusList;
          var msg = res.data.msg;
          var status = res.data.status;
          if (status) {
            for (var i = 0; i < opusList.length; i++) {
              if (opusList[i].oid == oid) {
                opusList[i].vote = parseInt(opusList[i].vote) + 1;
                opusList[i].isVote = true;
              }
            };

            that.setData({
              opusList: opusList
            });
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
        var opusList = that.data.opusList;
        for (var i = 0; i < opusList.length; i++) {
          if (opusList[i].oid == oid) {
            opusList[i].isZan = !opusList[i].isZan;
            opusList[i].thumb = parseInt(opusList[i].thumb) - 1;
          }
        };
        that.setData({
          opusList: opusList
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
        var opusList = that.data.opusList;
        for (var i = 0; i < opusList.length; i++) {
          if (opusList[i].oid == oid) {
            opusList[i].isZan = !opusList[i].isZan;
            opusList[i].thumb = parseInt(opusList[i].thumb) + 1;
          }
        };
        that.setData({
          opusList: opusList
        });
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  bottom: function () {
    var that = this;
    var sign = wx.getStorageSync("sign");
    var pid = that.data.pid;
    var oldPage = that.data.page;
    var loadEnd = that.data.loadEnd;
    if(loadEnd){
      that.setData({
        loadEnd: false
      });
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/get-match-opus-list?sign=' + sign,
        data: {
          pid: pid,
          page: oldPage,
          limit: 10
        },
        success: function (res) {
          console.log("排行榜", res);
          var opusList = that.data.opusList;
          var new_opusList = res.data.data.opusList;
          if (new_opusList.length !== 0){
            new_opusList = opusList.concat(new_opusList);
            oldPage++;
            that.setData({
              opusList: new_opusList,
              page: oldPage
            })
          }else{
            wx.showToast({
              title: '没有数据了',
            })
          }

          that.setData({
            loadEnd: true
          })
        
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var sharecode = wx.getStorageSync("sharecode");
    var oid = that.data.matchOpus.oid;

    return {
      title: '邀请好友投票！',
      path: '/pages/votePage/votePage?oid=' + oid,
      success: function (res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败");
      },
      complete: function () {
        console.log("已转发");
      }
    }
  },
})