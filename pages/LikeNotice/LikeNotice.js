// pages/myWorks/myWorks.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     myWorks:"",
     page:2,
     loadEnd:true
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

// 生命周期函数--监听页面显示
  onShow: function () {
     var that = this;
     var sign = wx.getStorageSync('sign');
       wx.request({
         url:'https://yulufan.playonwechat.com/site/get-notice-list?sign='+ sign,
         method:'GET',
         success:function(res){
            console.log("通知",res);
           var opusList = res.data.data.noticeList;
           that.setData({
             myWorks:opusList
           })
         }
       })
  },

// 加载更多
pageBottom:function(){
   var that = this;
   var sign = wx.getStorageSync('sign');
   var loadEnd = that.data.loadEnd;
   var page = that.data.page;
   var oldList = that.data.myWorks;
   if (loadEnd) {
      that.setData({
        loadEnd:false
      })
     wx.request({
       url:'https://yulufan.playonwechat.com/site/get-notice-list?sign='+ sign,
       method:'GET',
       data:{
         page:page
       },
       success:function(res){
          console.log(res);
         var opusList = res.data.data.noticeList;
         if (opusList.length>0) {
            page++;
            opusList = oldList.concat(opusList);
         }else {
           opusList = oldList;
           wx.showToast({
              title: '没有更多数据',
              icon: 'success',
              duration: 2000
            })
         }
         that.setData({
           loadEnd:true,
           page:page,
           myWorks:opusList
         })
       }
     })
   }

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
