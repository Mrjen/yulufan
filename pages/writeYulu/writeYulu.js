// pages/writeYulu/writeYulu.js
var app = getApp();
Page({

// 页面的初始数据
  data: {
    box_height:400,
    labelTag:[{
      id:2,
      static:true,
      tag:"语录"
    },{
      id:1,
      static:false,
      tag:"女神"
    }],
    tag_text:1
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

// 选择标签
  radioChange: function(e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var tag_text = e.detail.value;
   if (tag_text=="女神") {
       tag_text = 3;
    }else if (tag_text=="语录") {
       tag_text = 1;
    }
    console.log(tag_text);
    that.setData({
      tag_text:tag_text
    })
  },


  // 上传图片
  upLoadImg:function(){
     var that = this;
     app.getUserInfo(function(){
       var sign = wx.getStorageSync('sign');
       wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          success: function(res) {
            wx.showLoading({
               title: '图片上传中',
             });
             wx.getImageInfo({
                src: res.tempFilePaths[0],
                success: function (res) {
                  var box_height = res.height;
                  that.setData({
                    box_height:box_height
                  })
                }
              })
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url:'https://yulufan.playonwechat.com/site/upload-picture?sign='+ sign,
              filePath: tempFilePaths[0],
              name: 'file',
              success: function(res){
                console.log(res);
                var data = JSON.parse(res.data);
                data = data.data;
                that.setData({
                  upLoadImg:data
                });
                setTimeout(function(){
                  wx.hideLoading()
                },500)
              }
            })
          }
        })
     })
  },

  // 获取输入框内容
  bindTextAreaBlur:function(ev){
    var that = this;
    var textValue = ev.detail.value;
    // console.log(textValue);
    that.setData({
      textValue:textValue
    })
  },

  // 发布语录
  formSubmit:function(ev){
    var formId = ev.detail.formId;
    console.log(formId);
    var that = this;
    var textValue = that.data.textValue;
    var upLoadImg = that.data.upLoadImg;
    var tag_text = that.data.tag_text;
    var opus = {
      content:textValue,
      picture:upLoadImg
    }
    if (!textValue) {
      wx.showToast({
        title: '请填写语录内容',
        icon: 'success',
        duration: 2000
      })
    }else if (!upLoadImg) {
      wx.showToast({
        title: '请上传图片',
        icon: 'success',
        duration: 2000
      })
    }else if (!tag_text) {
      wx.showToast({
        title: '请选择标签',
        icon: 'success',
        duration: 2000
      })
    }else if (opus.content&&opus.picture) {
      wx.showModal({
        title: '提示',
        content: '上传作品需要审核，审核通过将显示在首页',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var sign = wx.getStorageSync('sign');
            wx.request({
              url: 'https://yulufan.playonwechat.com/site/save-opus?sign=' + sign + '&category=' + tag_text,
              method: 'POST',
              data: {
                opus: opus
              },
              success: function (res) {
                console.log(res);
                wx.request({
                  url:'https://yulufan.playonwechat.com/site/save-form-id?sign=' + sign,
                  data:{
                    form_id:formId
                  },
                  success(res){
                    console.log(res);
                  }
                })
                wx.showToast({
                  title: '作品已上传，审核通过将展示在首页',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../mine/mine'
                  })
                }, 1500)

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    };

  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

// 生命周期函数--监听页面显示
  onShow: function () {

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
