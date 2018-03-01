var { postList } = require("../../../data/posts-data.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        postData: {},
        collected:false,
        isPlayingMusic:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var postId = options.id
        this.setData({
            postData: postList[postId],
            postId: postId
        })

        var postsCollected = wx.getStorageSync('posts_ollected');
        if (!!postsCollected){
            var collected = postsCollected[postId]
            this.setData({
                collected: collected
            })
        }else{
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_ollected', postsCollected)
        }
        //设置全局变量
        if (app.globalData.g_isPlayingMusic && postId === app.globalData.g_currentMusicPostId){
            
            this.setData({
                isPlayingMusic: true
            })
        }


        var that = this;
        wx.onBackgroundAudioPlay(function(){
            that.setData({
                isPlayingMusic:true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = postId;
            
        })
        wx.onBackgroundAudioPause(function(){
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        })
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        })
    },
    onShareTap:function(){
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },
    onColletionTap:function(event){
        var postsCollected = wx.getStorageSync('posts_ollected');
        var postCollected = postsCollected[this.data.postId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },
    showToast: function (postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_ollected', postsCollected);
        // 更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },
    onMusicTap:function(event){
        var postId = this.data.postId;
        var isPlayingMusic = this.data.isPlayingMusic;
        if (!!isPlayingMusic){
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }else{
            wx.playBackgroundAudio({
                dataUrl: postList[postId].music.url,
                title: postList[postId].music.title,
                coverImgUrl: postList[postId].music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
        }    
    }
})