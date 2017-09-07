// pages/myMoney/myMoney.js
var app = getApp();
Page({
// 页面的初始数据
  data: {
     myMoney:23.66,
     MoneyImg:""
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

MoneyInput:function(ev){
  var that = this;
  var getMoney = ev.detail.value;
  var fee = getMoney*5/100;
  fee = fee.toFixed(2)
  var cash = getMoney - getMoney * 5/100;
      cash = cash.toFixed(2)
  that.setData({
    getMoney:getMoney,
    Fee:fee,
    Cash:cash
  })
},


// 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    app.getUserInfo(function(){
      var sign = wx.getStorageSync('sign');
      wx.request({
        url:'https://yulufan.playonwechat.com/site/get-userinfo?sign='+ sign,
        method:'GET',
        success:function(res){
          //console.log(res);
          var persion_info = res.data.data.userinfo[0].profit;
          that.setData({
            myMoney:persion_info
          })
        }
      });

      // 请求付款码UserQrcode
      wx.request({
        url:'https://yulufan.playonwechat.com/site/user-qrcode?sign='+ sign,
        method:'GET',
        data:{
          belong:1
        },
        success:function(res){
          console.log(res);
          that.setData({
            MoneyImg:res.data.data
          })
        }
      });

    })
  },

// 预览支付码
prewCode:function(ev){
  console.log(ev);
  var _src = ev.target.dataset.src;
  console.log(_src);
  wx.previewImage({
    current: _src, // 当前显示图片的http链接
    urls:[_src] // 需要预览的图片http链接列表
  })
},

// 上传支付码
  upMoneyImg:function(){
    var that = this;
    var sign = wx.getStorageSync('sign');
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.showLoading({
           title: '图片上传中',
         });
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
            wx.uploadFile({
              url:'https://yulufan.playonwechat.com/site/upload-qrcode?sign='+ sign,
              filePath: tempFilePaths[0],
              name: 'file',
              formData:{
                'belong': 1
              },
              success: function(res){
                console.log(res);
                var data = JSON.parse(res.data);
                console.log(data);
                data = data.data;
                console.log(data);
                that.setData({
                  MoneyImg:data
                });
                console.log(that.data);
                setTimeout(function(){
                  wx.hideLoading()
                },500)
              }
            })
          }
        })
      }
    })
  },

// 点击提现按钮
GetMonyBtn:function(){
   var that = this;
   var sign = wx.getStorageSync('sign');
   var getMoney = that.data.getMoney;
   var myMoney = that.data.myMoney;
   console.log(getMoney);
   wx.showModal({
     title: '温馨提示',
     content: '是否确认提现',
     success:function(res){
       if(res.confirm){
         wx.request({
          url:'https://yulufan.playonwechat.com/site/withdraw-cash?sign='+ sign,
          data:{
            amount:getMoney
          },
          success:function (res) {
              console.log(res);
              if (res.data.status) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 1000
                });
                myMoney = myMoney-getMoney;
                that.setData({
                  myMoney:myMoney
                })
              }else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 1000
                });
              }
          }
        })
       }else{

       }
         
     }
   })
  //  
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
