// pages/swiperPage/swiperPage.js
Page({
// 页面的初始数据
  data: {
    imgSrc:""
  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var _src = options.src;
    that.setData({
      imgSrc:_src
    })
  },

  downLoad:function(){
    var that = this;
    var imgSrc = that.data.imgSrc;
    console.log(imgSrc);
    if (imgSrc){
      wx.downloadFile({
        url: imgSrc,
        success: function (res) {
          console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res);
              wx.showToast({
                title: '下载成功，请到相册查看',
                icon: 'success',
                duration: 1000
              })
            },
            fail: function () {
              wx.getSetting({
                success: (res) => {
                  console.log(res);
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '系统检测到您没有允许语录范保存图片到相册，是否打开设置？',
                      success: function (res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success: (res) => {
                            }
                          })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                }
              })

            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '下载失败',
        icon: 'success',
        duration: 1000
      })
    }
    
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
