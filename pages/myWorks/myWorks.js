// pages/myWorks/myWorks.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myWorks: "",
    page: 2
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

  toWork:function(ev){
    console.log(ev);
    var that = this;
    // console.log(that.data.myWorks);
    var oid = ev.currentTarget.dataset.oid;
    var status = ev.currentTarget.dataset.status;
    console.log(status);
    var myWorks = that.data.myWorks;
    if (status=="通过审核") {
      // wx.navigateTo({
      //   url:"../downLoad/downLoad?oid="+oid
      // })
      wx.navigateTo({
        url:"../lookDetail/lookDetail?oid="+oid + '&choose=1'
      })
    }else {
      wx.showToast({
        title: '此作品正在审核或者未通过审核',
        icon: 'success',
        duration: 1000
       })
    }
  },

  // 生命周期函数--监听页面显示
  onShow: function() {
    var that = this;
    app.getUserInfo(function() {
      var sign = wx.getStorageSync('sign');
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/my-opus-list?sign=' + sign,
        method: 'GET',
        success: function(res) {
          console.log(res);
          var opusList = res.data.data.opusList;
          for (var i = 0; i < opusList.length; i++) {
            if (opusList[i].status == 0) {
              opusList[i].status = "审核中";
            } else if (opusList[i].status == 1) {
              opusList[i].status = "通过审核";
            } else if (opusList[i].status == 2) {
              opusList[i].status = "未通过审核";
            }
          }
          that.setData({
            myWorks: opusList
          })
        }
      })
    })
  },

  pageBottom: function(ev) {
    var that = this;
    var page = that.data.page;
    wx.showLoading({
      title: '加载中',
    });
    app.getUserInfo(function() {
      var sign = wx.getStorageSync('sign');
      wx.request({
        url: 'https://yulufan.playonwechat.com/site/my-opus-list?sign=' + sign,
        method: 'GET',
        data: {
          page: page
        },
        success: function(res) {
          //console.log(res);
          console.log(page);
          var opusList = res.data.data.opusList;
          var oldList = that.data.myWorks;
          for (var i = 0; i < opusList.length; i++) {
            if (opusList[i].status == 0) {
              opusList[i].status = "审核中";
            } else if (opusList[i].status == 1) {
              opusList[i].status = "通过审核";
            } else if (opusList[i].status == 2) {
              opusList[i].status = "未通过审核";
            }
          }
          if (opusList.length < 1) {
            wx.showToast({
              title: '没有更多数据了',
              icon: 'success',
              duration: 1000
            })
          } else {
            page++;
            that.setData({
              myWorks: oldList.concat(opusList),
              page: page
            });
          }
        }
      })
    })
  },

  // 生命周期函数--监听页面隐藏
  onHide: function() {

  },

  // 生命周期函数--监听页面卸载
  onUnload: function() {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {

  },

  // 用户点击右上角分享
  onShareAppMessage: function() {

  }
})
