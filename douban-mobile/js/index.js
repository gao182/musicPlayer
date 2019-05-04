var Tabs = {
  init : function(){
    this.$tab = $('footer>div');
    this.$panel = $('main section');
    this.bind();
  },
  bind : function(){
    var _this = this;
    this.$tab.on('click', function(){
      var index = $(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      _this.$panel.eq(index).show().siblings().hide();
    })
  }
}

var Common = {
  createNode : function(movie){
   var $node = $('<div class="item">\
      <a href="#">\
        <div class="img">\
          <img src="" alt="">\
        </div>\
        <div class="info">\
          <h2>楚门的世界</h2>\
          <span class="year">(1999)</span>\
          <div class="score">\
            <span class="star"></span>\
            <span class="number">9.6</span>\
          </div>\
          <span></span>收藏 / \
          <span></span> <br>\
          <span></span> / \
          <span></span>\
        </div>\
      </a>\
    </div>')
    $node.find('a').attr('href',movie.alt);
    $node.find('.img img').attr('src', movie.images.small);
    $node.find('h2').text(movie.title);
    $node.find('.year').text('(' + movie.year + ')');
    $node.find('.score .number').text(movie.rating.average);
    $node.find('.info>span').eq(1).text(movie.collect_count);
    $node.find('.info>span').eq(2).text(movie.genres.join(' '));
    $node.find('.info>span').eq(3).text(function(){
      var arr = []
      movie.directors.forEach(function(item){
        arr.push(item.name)
      })
      return arr.join(' ')
    });
    $node.find('.info>span').eq(4).text(function(){
      var arr = []
      movie.casts.forEach(function(item){
        arr.push(item.name)
      })
      return arr.join(' ')
    });

    var i = movie.rating.average;
    if (i > 0 && i <= 0.1) {
      $node.find('.info .score .star').css('background-position', '0 -101px')
    }else if (i > 0.1 && i <= 1.1) {
      $node.find('.info .score .star').css('background-position', '0 -91px')
    }else if (i > 0.1 && i <= 2.1) {
      $node.find('.info .score .star').css('background-position', '0 -81px')
    }else if (i > 2.1 && i <= 3.1) {
      $node.find('.info .score .star').css('background-position', '0 -71px')
    }else if (i > 3.1 && i <= 4.1) {
      $node.find('.info .score .star').css('background-position', '0 -61px')
    }else if (i > 4.1 && i <= 5.1) {
      $node.find('.info .score .star').css('background-position', '0 -54px')
    }else if (i > 5.1 && i <= 6.1) {
      $node.find('.info .score .star').css('background-position', '0 -43px')
    }else if (i > 6.1 && i <= 7.1) {
      $node.find('.info .score .star').css('background-position', '0 -33px')
    }else if (i > 7.1 && i <= 8.1) {
      $node.find('.info .score .star').css('background-position', '0 -22px')
    }else if (i > 8.1 && i <= 9.1) {
      $node.find('.info .score .star').css('background-position', '0 -11px')
    }else if (i > 9.1) {
      $node.find('.info .score .star').css('background-position', '0 0');
    }else if (i <= 0) {
      $node.find('.info .score .star').css('background-position', '0 -111px');
    }

    return $node;
  }
}

var Top250 = {
  init : function(){
    var _this = this;
    this.$panel = $('.top250');
    this.$ct = $('.top250 .content');
    this.index = 0;
    this.isLoading = false;
    this.$loadicon = $('.top250 .loading');
    this.isfinish = false;
    this.clock;

    this.getData(function(data){
      _this.appendData(data);
    });
    this.bind();
  },
  bind : function(){
    var _this = this;
    _this.$panel.scroll(function(){
      if (_this.clock) {
        clearTimeout(_this.clock);
      }
      _this.clock = setTimeout(function(){
        if (_this.$ct.height() - 4 <= _this.$panel.scrollTop() + _this.$panel.height() && !_this.isFinshed) {
          _this.getData(function(data){
            _this.appendData(data);
            if (_this.index > data.total ) { 
              _this.isFinshed = true;
            }
          });
        }
      },600)
    })
  },
  getData : function(callback){
    var _this = this;
    if(_this.isLoading) { return }
    _this.isLoading = true;
    _this.$loadicon.show();
    $.ajax({
      url: 'https://api.douban.com/v2/movie/top250',
      data: {
        start: _this.index,
        count: 20
      },
      dataType: 'jsonp'
    }).done(function(req){
      _this.index += 20;
      _this.$loadicon.hide();
      callback(req)
    }).always(function(){
      _this.isLoading = false;
    })
  },
  appendData : function(data){
    var _this = this;
    data.subjects.forEach(function(movie){
      var $node = Common.createNode(movie);
      _this.$ct.append($node)
    })
  }
}

var USdetail = {
  init : function(){
    var _this = this;
    this.$panel = $('.US');
    this.$ct = $('.US .content');
    this.index = 0;
    this.isLoading = false;
    this.$loadicon = $('.US .loading');
    this.isfinish = false;
    this.clock;

    this.getData(function(data){
      _this.appendData(data);
    });
  },
  getData : function(callback){
    var _this = this;
    if(_this.isLoading) { return }
    _this.isLoading = true;
    _this.$loadicon.show();
    $.ajax({
      url: 'https://api.douban.com/v2/movie/us_box',
      data: {
        start: _this.index,
        count: 20
      },
      dataType: 'jsonp'
    }).done(function(req){
      _this.index += 20;
      _this.$loadicon.hide();
      callback(req)
    }).always(function(){
      _this.isLoading = false;
    })
  },
  appendData : function(data){
    var _this = this;
    data.subjects.forEach(function(movie){
      var $node = Common.createNode(movie.subject)  
      _this.$ct.append($node)
    })
  }
}

var Search = {
  init : function(){
    var _this = this;
    this.$text = $('.search-box input');
    this.$btn = $('.search-box .button');
    this.$panel = $('.search-panel');
    this.$ct = $('.search-panel .content');
    this.index = 0;
    this.isLoading = false;
    this.$loadicon = $('.search-panel .loading');
    this.isfinish = false;
    this.clock;

    this.bind();
  },
  bind : function(){
    var _this = this;
    this.$btn.click(function(){
      _this.$ct.text(' ')
      _this.getData(function(data){
        _this.appendData(data);
      });
    })
    this.$text.on('keyup', function(e){
      if(e.key === 'Enter') {
        _this.$ct.text(' ');
        _this.getData(function(data){
          _this.appendData(data);
        })
      }
    })
  },
  getData : function(callback){
    var _this = this;
    var keyvalue = this.$text.val();
    if(_this.isLoading) { return }
    _this.isLoading = true;
    _this.$loadicon.show();
    $.ajax({
      url: 'https://api.douban.com/v2/movie/search',
      data: {
        q: keyvalue
      },
      dataType: 'jsonp'
    }).done(function(req){
      _this.$loadicon.hide();
      callback(req)
    }).always(function(){
      _this.isLoading = false;
    })
  },
  appendData : function(data){
    var _this = this;
    data.subjects.forEach(function(movie){
      var $node = Common.createNode(movie)  
      _this.$ct.append($node)
    })
  }
}

var App = {
  init : function(){
    Tabs.init();
    Top250.init();
    USdetail.init();
    Search.init();
  }
}
App.init();


// function ajaxRequest(){
//   if(isLoading) { return }
//   isLoading = true;
//   $('.loading').show();
//   $.ajax({
//     url: 'http://api.douban.com/v2/movie/top250',
//     data: {
//       start: index,
//       count: 20
//     },
//     dataType: 'jsonp'
//   }).done(function(req){
//     appendData(req);
//     index += 20;
//     $('.loading').hide();
//   }).always(function(){
//     isLoading = false;
//   })
// }
// ajaxRequest();

// function appendData(data){
//   data.subjects.forEach(function(movie){
//     var $node = $('<div class="item">\
//       <a href="#">\
//         <div class="img">\
//           <img src="http://img1.doubanio.com/view/photo/s_ratio_poster/public/p479682972.jpg">\
//         </div>\
//         <div class="info">\
//           <h2>楚门的世界</h2>\
//           <span class="year">(1999)</span>\
//           <div class="score">\
//             <span class="star"></span>\
//             <span class="number">9.6</span>\
//           </div>\
//           <span></span>收藏 / \
//           <span></span> <br>\
//           <span></span> / \
//           <span></span>\
//         </div>\
//       </a>\
//     </div>')
//     $node.find('a').attr('href',movie.alt);
//     $node.find('.img img').attr('src', movie.images.large);
//     $node.find('h2').text(movie.title);
//     $node.find('.year').text('(' + movie.year + ')');
//     $node.find('.score .number').text(movie.rating.average);
//     $node.find('.info>span').eq(1).text(movie.collect_count);
//     $node.find('.info>span').eq(2).text(movie.genres.join(' '));
//     $node.find('.info>span').eq(3).text(function(){
//       var arr = []
//       movie.directors.forEach(function(item){
//         arr.push(item.name)
//       })
//       return arr.join(' ')
//     });
//     $node.find('.info>span').eq(4).text(function(){
//       var arr = []
//       movie.casts.forEach(function(item){
//         arr.push(item.name)
//       })
//       return arr.join(' ')
//     });

//     var i = movie.rating.average;
//     if (i > 0 && i <= 0.1) {
//         $node.find('.info .score .star').css('background-position', '0 -101px')
//     }else if (i > 0.1 && i <= 1.1) {
//         $node.find('.info .score .star').css('background-position', '0 -91px')
//     }else if (i > 0.1 && i <= 2.1) {
//         $node.find('.info .score .star').css('background-position', '0 -81px')
//     }else if (i > 2.1 && i <= 3.1) {
//         $node.find('.info .score .star').css('background-position', '0 -71px')
//     }else if (i > 3.1 && i <= 4.1) {
//         $node.find('.info .score .star').css('background-position', '0 -61px')
//     }else if (i > 4.1 && i <= 5.1) {
//         $node.find('.info .score .star').css('background-position', '0 -51px')
//     }else if (i > 5.1 && i <= 6.1) {
//         $node.find('.info .score .star').css('background-position', '0 -41px')
//     }else if (i > 6.1 && i <= 7.1) {
//         $node.find('.info .score .star').css('background-position', '0 -31px')
//     }else if (i > 7.1 && i <= 8.1) {
//         $node.find('.info .score .star').css('background-position', '0 -21px')
//     }else if (i > 8.1 && i <= 9.1) {
//         $node.find('.info .score .star').css('background-position', '0 -11px')
//     }else if (i > 9.1) {
//         $node.find('.info .score .star').css('background-position', '0 0');
//     }

//     $('.top250 .content').append($node)
//   })
// }

// var clock
// $('main').scroll(function(){
//   if (clock) {
//     clearTimeout(clock);
//   }
//   clock = setTimeout(function(){
//     if ($('.top250').height() - 4 <= $('main').scrollTop() + $('main').height()) {
//       ajaxRequest();
//     }
//   },600)

// })