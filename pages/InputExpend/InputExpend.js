// pages/InputExpend/InputExpend.js
var app = getApp();
Page({
// 页面的初始数据
  data: {
     MoneyList:[],
     page:2,
     loadEnd:true,
     moreData:false
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
        url:'https://yulufan.playonwechat.com/site/exchange-records?sign='+ sign,
        method:"GET",
        data:{
          page:1,
          limit:20
        },
        success:function(res){
          console.log(res);
          var inputexpend = res.data.data.exchangeRecords;
          that.setData({
            MoneyList: inputexpend
          })
        }
      })
  },

// 页面触底事件
pageBottom:function(){
   var that = this;
   var page = that.data.page;
   var loadEnd = that.data.loadEnd;
   var sign = wx.getStorageSync('sign');
     if (loadEnd) {
       that.setData({
         loadEnd:false
       });
       wx.showLoading({
         title: '数据加载中',
       });
       wx.request({
         url:'https://yulufan.playonwechat.com/site/exchange-records?sign='+ sign,
         method:"GET",
         data:{
           page:page
         },
         success:function(res){
           console.log(res);
           var inputexpend = res.data.data.exchangeRecords;
           var oldData = that.data.MoneyList;
           var moreData = that.data.moreData;
           setTimeout(function(){
             wx.hideLoading()
           },500);
           if (inputexpend.length>0) {
             page++;
             oldData = oldData.concat(inputexpend);
           }else {
             oldData = oldData;
             moreData = true;
           }
           that.setData({
             MoneyList:oldData,
             page:page,
             loadEnd:true,
             moreData:moreData
           });
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
