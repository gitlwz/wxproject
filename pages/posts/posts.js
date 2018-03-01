var postsData = require("../../data/posts-data.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        posts_key: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            posts_key: postsData.postList
        });
    },
    onPostTap:function(e){
        var postId = e.currentTarget.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id='+postId,
        })
    },
    onSwiperTap: function (e){
        var postId = e.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    }
})