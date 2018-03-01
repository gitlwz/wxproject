// pages/movies/more-movie/more-movie.js

var app = getApp();
let { http, convertToStarsArray } = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies:{},
        totalCount:0,
        reuqestUrl:null,
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        console.log("6666", category)
        wx.setNavigationBarTitle({
            title: category,
        })

        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.setData({
            reuqestUrl: dataUrl
        })
        http(dataUrl, this.processDoubanData)
    },
    processDoubanData: function (moviesDouban){
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subjects = moviesDouban.subjects[idx];
            var title = subjects.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: convertToStarsArray(subjects.rating.stars),
                title: title,
                average: subjects.rating.average,
                coverageUrl: subjects.images.large,
                movieId: subjects.id
            }
            
            
            movies.push(temp)
        }
        var totalMovies = {};
        if (!this.data.isEmpty){
            totalMovies = this.data.movies.concat(movies);
        }else{
            totalMovies = movies;
        }
        this.setData({ 
                movies: totalMovies, 
                totalCount: this.data.totalCount + 20,
                isEmpty:false
            })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
    },
    onPullDownRefresh:function(e){
        var refreshUrl = this.data.reuqestUrl +
            "?start=0&count=20";
        this.setData({
            totalCount:0,
            isEmpty:true
        })
        console.log("777777777")
        http(refreshUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onScrollLower:function(e){
        var nextUrl = this.data.reuqestUrl + 
            "?start=" + this.data.totalCount + "&count=20";
        http(nextUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onMovieTap: function (event) {
        console.log(111)
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId
        })
    }

})