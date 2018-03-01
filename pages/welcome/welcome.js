Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    onTap: function () {
        wx.switchTab({
            url: '/pages/posts/posts',
        })
    }
})