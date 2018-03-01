var app = getApp();
let { convertToStarsArray } = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters:{},
        comingSoon:{},
        top250:{},
        searchResult:{},
        containerShow: true,
        searchPanelShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl, 'inTheaters');
        this.getMovieListData(comingSoonUrl, 'comingSoon');
        this.getMovieListData(top250Url, 'top250');
    },
    getMovieListData: function (url,settedKey) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                that.processDoubanData(res.data, settedKey)
            },
            fail: function (error) {
                // fail
                console.log(error)
            }
        })
    },
    onMoreTap:function(e){
        var category = e.currentTarget.dataset.category;
        console.log("6666", category)
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category
        })
    },
    onMovieTap:function(e){
        var movieId = e.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?id=" + movieId
        })
    },
    processDoubanData: function (moviesDouban, settedKey){
        var movies = [];
        for (var idx in moviesDouban.subjects){
            var subjects = moviesDouban.subjects[idx];
            var title = subjects.title;
            if (title.length >= 6){
                title = title.substring(0,6) + "...";
            }
            // var _stars = parseInt(subjects.rating.average / 2);
            // var __stars = [];
            // for(let i = 1;i<=5;i++){
            //     if (i <= _stars){
            //         __stars.push(1);
            //     }else{
            //         __stars.push(0);
            //     }
            // }

            var temp = {
                stars: convertToStarsArray(subjects.rating.stars),
                title:title,
                average: subjects.rating.average,
                coverageUrl: subjects.images.large,
                movieId: subjects.id
            }

            movies.push(temp)
        }
        var readyData = {};
        readyData[settedKey] = movies;
        this.setData(readyData)
    },
    onBindFocus:function(e){
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        })
    },
    onCancelImgTap:function(){
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            // searchResult:[]
        })
    },
    onBindConfirm:function(e){
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + e.detail.value;
        this.getMovieListData(searchUrl, "searchResult", "")
    }
    
})