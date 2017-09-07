// pages/writeYulu/writeYulu.js
var app = getApp();
Page({

  // 页面的初始数据
  data: {
    box_height: 400,
    tag_text: ""
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var pid = options.pid;
    this.setData({
      pid: pid
    })
  },


  // 上传图片
  upLoadImg: function () {
    var that = this;
    app.getUserInfo(function () {
      var sign = wx.getStorageSync('sign');
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (res) {
          wx.showLoading({
            title: '图片上传中',
          });
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
              var box_height = res.height;
              that.setData({
                box_height: box_height
              })
            }
          })
          var tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: 'https://yulufan.playonwechat.com/site/upload-picture?sign=' + sign,
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              console.log(res);
              var data = JSON.parse(res.data);
              data = data.data;
              that.setData({
                upLoadImg: data
              });
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
            }
          })
        }
      })
    })
  },

  // 获取输入框内容
  bindTextAreaBlur: function (ev) {
    var that = this;
    var textValue = ev.detail.value;
    // console.log(textValue);
    that.setData({
      textValue: textValue
    })
  },

  // 发布语录
  upLoadBtn: function () {
    var that = this;
    var textValue = that.data.textValue;
    var upLoadImg = that.data.upLoadImg;
    var tag_text = that.data.tag_text;
    var pid = that.data.pid;
    var opus = {
      content: textValue,
      picture: upLoadImg
    }
    if (!textValue) {
      wx.showToast({
        title: '请填写语录内容',
        icon: 'success',
        duration: 2000
      })
    } else if (!upLoadImg) {
      wx.showToast({
        title: '请上传图片',
        icon: 'success',
        duration: 2000
      })
    }  else if (opus.content && opus.picture) {
      wx.showModal({
        title: '提示',
        content: '上传作品需要审核，审核通过将显示在活动页',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var sign = wx.getStorageSync('sign');
            wx.request({
              url: 'https://yulufan.playonwechat.com/site/save-opus?sign=' + sign + '&category=' + 4 + '&pid=' + pid,
              method: 'POST',
              data: {
                opus: opus
              },
              success: function (res) {
                console.log(res);
                wx.showToast({
                  title: '作品已上传，审核通过将展示在活动页',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../active/active?pid=' + pid
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

  }
})
