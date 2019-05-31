var CategoryList = {
	init: function () {
		this.$panel = $('.songCD');
		this.$ul = this.$panel.find('.songCD-name')

		this.getData();
	},
	getData: function () {
		$.getJSON('//v1.itooi.cn/netease/songList/category')
			.done((rep) => {
				this.renderData(rep.data.sub)
			}).fail(function (e) {
				throw new Error(e)
			})
	},
	renderData: function (data) {
		var newData = [].concat(data[Math.floor(Math.random() * 72)],
			data[Math.floor(Math.random() * 72)], data[Math.floor(Math.random() * 72)],
			data[Math.floor(Math.random() * 72)], data[Math.floor(Math.random() * 72)])
		var html = "";
		newData.forEach((list) => {
			html += '<li><a href="javascript:;">' + list.name + '</a></li>'
		})
		this.$ul.html('<li><a class="active" href="javascript:;">热门推荐</a></li>' + html);
	}
}

var SongList = {
	init: function () {
		this.$panel = $('.songCD');
		this.$ul = this.$panel.find('.box>ul');
		this.$left = this.$panel.find('span.icon-left');
		this.$right = this.$panel.find('span.icon-right');
		this.$box = this.$panel.find('.box');
		this.$name = this.$panel.find('.songCD-name');
		this.isAnimate = false;
		this.isToStart = true;
		this.isToEnd = false;

		this.getData(this.$name.find('a.active'));
		this.bind();
	},
	bind: function () {
		var _this = this;
		$('nav .menu').on('click', function () {
			if ($(this).hasClass('active')) {
				$('nav ul.classify').removeClass('active');
				$('#logo').removeClass('active');
				$(this).removeClass('active');
			} else {
				$('nav ul.classify').addClass('active');
				$('#logo').addClass('active');
				$(this).addClass('active');
			}
		})
		this.$left.on('click', function () {
			if (_this.isAnimate || _this.isToStart) { return }
			var liWidth = _this.$ul.find('li').outerWidth(true);
			var columns = Math.floor(_this.$box.width() / liWidth);
			if (!_this.isToStart) {
				_this.isAnimate = true;
				_this.$ul.animate({
					left: '+=' + columns * liWidth
				}, 400, function () {
					_this.isAnimate = false;
					_this.isToEnd = false;
					if (parseFloat(_this.$ul.css('left')) >= -1) {
						_this.isToStart = true;
					}
				})
			}
		})
		this.$right.on('click', function () {
			if (_this.isAnimate || _this.isToEnd) { return }
			var liWidth = _this.$ul.find('li').outerWidth(true);
			var columns = Math.floor(_this.$box.width() / liWidth);
			if (!_this.isToEnd) {
				_this.isAnimate = true;
				_this.$ul.animate({
					left: '-=' + columns * liWidth
				}, 400, function () {
					_this.isAnimate = false;
					_this.isToStart = false;
					if (parseFloat(_this.$box.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.width())) {
						_this.isToEnd = true;
					}
				})
			}
		})
		// this.$ul.on('click', 'li', function () {
		// 	document.location = $(this).attr('data-id');
		// })
		this.$name.on('click', 'li', function (e) {
			$(this).find('a').addClass('active');
			$(this).siblings().find('a').removeClass('active');
			_this.$ul.css({ left: 0 });
			_this.getData($(this).find('a'));
		})
	},
	getData: function (name) {
		var _this = this;
		var url;
		if (name.text() === '热门推荐') {
			url = "//v1.itooi.cn/netease/songList/hot?pageSize=20&page=0";
		} else {
			url = "//v1.itooi.cn/netease/search?keyword=" + name.text() + "&type=songList&pageSize=20&page=0";
		}
		$.getJSON(url)
			.done(function (rep) {
				_this.renderData(rep);
			}).fail(function (e) {
				throw new Error(e);
			})
	},
	renderData: function (data) {
		var html = "";
		var newData = data.data.playlists ? data.data.playlists : data.data
		newData.forEach(function (list) {
			html += '<li data-id="' + list.id + '">\
						<a href="player.html?songlist='+list.id+'" target="_blank">\
							<div class="img" style="background-image: url('+ list.coverImgUrl + ');"></div>\
							<p>'+ list.name + '</p>\
						</a>\
					</li>';
		})
		this.$ul.html(html);
		this.setStyle();
	},
	setStyle: function () {
		var count = this.$ul.find('li').length;
		var liWidth = this.$ul.find('li').outerWidth(true);
		this.$ul.css({
			width: count * liWidth + 'px'
		});
	}
}

CategoryList.init();
SongList.init();