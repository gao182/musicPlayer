//通过ajax获取json数据
/*function getMusiclist(callee){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://gao182.github.io/musicPlayer/css/intor.json', true);
	xhr.onload = function() {
		if (xhr.status >=200 && xhr.status <= 300 || xhr.status === 304) {
			callee(JSON.parse(this.responseText));
		}else{
			console.log(xhr.status, '请求发生错误');
		}
	}
	xhr.onerror = function() {
		console.log(xhr.status, '请求发生错误');
	}
	xhr.ontimeout = function() {
		console.log(xhr.status, '请求发生错误');
	}
	xhr.send() 
}
*/

//建立操作音乐的函数，在数据获得后执行
window.onload = function(){
	var musicObj = [{
		"name" : "生僻字",
		"writer" :"陈柯宇",
		"src" : "http://www.ytmp3.cn/down/56174.mp3",
		"poster" : "http://p1.music.126.net/VeYGMisCd0Jvw9TUtqZwqQ==/109951163803411503.jpg"
	},{
		"name" : "打上花火",
		"writer" :"DAOKO / 米津玄師",
		"src" : "http://www.ytmp3.cn/down/43353.mp3",
		"poster" : "http://p1.music.126.net/ZUCE_1Tl_hkbtamKmSNXEg==/109951163009282836.jpg"
	},{
		"name" : "Lemon",
		"writer" :"米津玄師",
		"src" : "http://www.ytmp3.cn/down/51031.mp3",
		"poster" : "http://p2.music.126.net/6IeZ9MiSSDXifj74nzH6ww==/109951163561494000.jpg"
	},{
		"name" : "my all",
		"writer" :"浜崎あゆみ",
		"src" : "http://www.ytmp3.cn/down/36823.mp3",
		"poster" : "http://p1.music.126.net/JqX4G4ocCgxMf8azzhUKAQ==/109951163244714366.jpg"
	},{
		"name" : "孙大剩",
		"writer" :"赵静 / 白亮",
		"src" : "http://www.ytmp3.cn/down/50623.mp3",
		"poster" : "http://p2.music.126.net/5PI5cPypdVcn8rm2YerPsg==/109951163005769076.jpg"
	}];
	function $(select) {
		return document.querySelector(select);
	}
	function $$(select) {
		return document.querySelectorAll(select);
	}

	var audioObj = new Audio();
	var sortInt = 0;
	var setTime;


	//音乐加载后播放，及信息
	function loadMusic(list) {
		audioObj.autoplay = true;
		audioObj.src = list['src'];

		$$('.music-player .name')[0].innerText = list['name'];
		$$('.music-player .writer')[0].innerText = list['writer'];
		$$('.music-player .writer-img')[0].src = list['poster'] + '?param=100y100';
		$$('.music-player .name')[1].innerText = list['name'];
		$$('.music-player .writer')[1].innerText = list['writer'];
		$$('.music-player .writer-img')[1].src = list['poster'] + '?param=100y100';
		$('.content .poster').src = list['poster'] + '?param=600y600';
		$(".timeline .progress-now").style.width = '0';
		$(".volumeline .progress-now").style.width = audioObj.volume * 100 + '%';

	}
	loadMusic(musicObj[sortInt]);
	musicList(musicObj);

	//音乐栏选中状态
	$$('.list-item')[sortInt].classList.add('active');
	$$('.list-item .iconfont')[sortInt].classList.replace('incon-pause', 'incon-play');

	//控制台按钮
	$$('.control .play')[0].onclick = function(e) { switchMusic(e) };
	$$('.control .play')[1].onclick = function(e) { switchMusic(e) };
	$$('.control .backward')[0].onclick = function() { backMusic() };
	$$('.control .backward')[1].onclick = function() { backMusic() };
	$$('.control .forward')[0].onclick = function() { forMusic() };
	$$('.control .forward')[1].onclick = function() { forMusic() };

	//音乐栏按钮
	$('.musiclist').addEventListener('click', function(e){ clickList(e) });

	//音乐时间轴
	$('.timeline .bar').onclick = function(e){
		$(".timeline .bar>.progress-now").style.width = Math.floor(e.offsetX / parseInt(getComputedStyle(this).width) * 100) + '%';
		audioObj.currentTime = audioObj.duration * (e.offsetX / parseInt(getComputedStyle(this).width))
	};
	//音量轴
	$('.volumeline .bar').onclick = function(e){
		$(".volumeline .bar>.progress-now").style.width = Math.floor(e.offsetX / parseInt(getComputedStyle(this).width) * 100) + '%';
		audioObj.volume = 1 * (e.offsetX / parseInt(getComputedStyle(this).width))
	};
	//是否单曲循环
	$('.cycle .iconfont').onclick = function(){
		if (this.classList.contains("icon-cycle")) {
			audioObj.loop = true;
			this.classList.replace('icon-cycle', 'icon-single');
		}
		else{
			audioObj.loop = false;
			this.classList.replace('icon-single', 'icon-cycle');
		}
	}

//音乐时间判断
function countTimes(time){
	if (time < 60) {
		var minutes = "00";
		var seconds = (Math.floor(time) + "").length < 2 ? "0" + Math.floor(time) : Math.floor(time);
	}
	else {
		var minutes = (Math.floor(time/60) + "").length < 2 ? "0" + Math.floor(time/60) : Math.floor(time/60);
		var seconds = (Math.floor(time%60) + "").length < 2 ? "0" + Math.floor(time%60) : Math.floor(time%60);			
	}
	return minutes + ":" + seconds
}

//播放音乐时
audioObj.onplaying = function(){
	$('.music-footer .timeline .time-total').innerText = countTimes(audioObj.duration);
	$$('.control .play .iconfont')[0].classList.replace('icon-pause', 'icon-play');
	$$('.control .play .iconfont')[1].classList.replace('icon-pause', 'icon-play');

	for (var i = 0 ; i < musicObj.length ; i++) {
		$$('.list-item')[i].classList.remove('active');
		$$('.list-item .iconfont')[i].classList.replace('incon-play', 'incon-pause');
	}
	$$('.list-item')[sortInt].classList.add('active');
	$$('.list-item .iconfont')[sortInt].classList.replace('incon-pause', 'incon-play');

	//定时器，每0.2s执行一次
	setTime = setInterval(function(){
		$('.music-footer .timeline .time').innerText = countTimes(audioObj.currentTime);
		$(".timeline .progress-now").style.width = Math.floor(audioObj.currentTime/audioObj.duration * 100) + '%';
		setCss3($('.content .poster').style, audioObj.currentTime);
	}, 200);
}

//旋转光碟
function setCss3(tag, time){
	var rotate = "rotate("+ (22 * time) +"deg)";
	
	tag["transform"] = rotate;
	tag["-ms-transform"] = rotate;
	tag["-moz-transform"] = rotate;
	tag["-webkit-transform"] = rotate;
	tag["-o-transform"] = rotate;

	tag["transition-duration"] = time/24 +"s";
	tag["-moz-transition-duration"] = time/24 +"s";
	tag["-webkit-transition-duration"] = time/24 +"s";
	tag["-o-transition-duration"] = time/24 +"s";
}

//暂停音乐时
audioObj.onpause = function(){
	clearInterval(setTime);
}

//音乐播放完
audioObj.onended = function(){
	clearInterval(setTime);
	sortInt = sortInt === (musicObj.length - 1) ? 0 : ++sortInt;
	loadMusic(musicObj[sortInt]);
}

//上一曲
function forMusic(){
	clearInterval(setTime);
	sortInt = sortInt === 0 ? musicObj.length - 1 : --sortInt;
	loadMusic(musicObj[sortInt]);
}

//下一曲
function backMusic(){
	clearInterval(setTime);
	sortInt = sortInt === (musicObj.length - 1) ? 0 : ++sortInt;
	loadMusic(musicObj[sortInt]);
}

//点击音乐表
function clickList(e) {
	e.stopPropagation();
	if (e.target.classList.contains('list-item')) {
		sortInt = e.target.firstChild.innerText - 1;
	}
	else if (e.target.classList.contains('sort')) {
		sortInt = e.target.innerText - 1;
	}
	else if (e.target.classList.contains('name')) {
		sortInt = e.target.offsetParent.firstChild.innerText - 1;
	}
	else if (e.target.classList.contains('writer')) {
		sortInt = e.target.offsetParent.firstChild.innerText - 1;
	}
	else if (e.target.classList.contains('iconfont')) {
		sortInt = e.target.offsetParent.offsetParent.firstChild.innerText - 1;
	}
	else {
		return;
	}
	loadMusic(musicObj[sortInt]);
}

//暂停/播放音乐，更新按钮信息
function switchMusic(e){
	if(e.target.classList.contains('icon-play')){
		audioObj.pause();
		$$('.control .play .iconfont')[0].classList.replace('icon-play', 'icon-pause');
		$$('.control .play .iconfont')[1].classList.replace('icon-play', 'icon-pause');
	}
	else if(e.target.classList.contains('icon-pause')) {
		audioObj.play();
		$$('.control .play .iconfont')[0].classList.replace('icon-pause', 'icon-play');
		$$('.control .play .iconfont')[1].classList.replace('icon-pause', 'icon-play');
	}
}


//音乐表
function musicList(musicObj) {
	var musiclist = $('.musiclist');
	var fragment = document.createDocumentFragment();

	for (var i =  0 ; i < musicObj.length; i++) {
		//创建单个li
		var listItem = document.createElement('li');
		listItem.setAttribute('class', 'list-item');
		//创建序号
		var listSort = document.createElement('span');
		listSort.setAttribute('class', 'sort');
		listSort.innerText = (i+"").length < 2 ? "0" + (i + 1) : i + 1;
		//创建音乐名
		var listName = document.createElement('span');
		listName.setAttribute('class', 'name');
		listName.innerText = musicObj[i]['name'];
		//创建歌手
		var listWriter = document.createElement('span');
		listWriter.setAttribute('class', 'writer');
		listWriter.innerText = musicObj[i]['writer'];
		//创建按钮
		var listPlay = document.createElement('span');
		listPlay.setAttribute('class', 'play');
		//创建字标
		var iconfont = document.createElement('i');
		iconfont.setAttribute('class', 'iconfont icon-pause');
		listPlay.appendChild(iconfont);

		//添加元素
		listItem.appendChild(listSort);
		listItem.appendChild(listName);
		listItem.appendChild(listWriter);
		listItem.appendChild(listPlay);
		fragment.appendChild(listItem);
	}
	musiclist.appendChild(fragment);
}

}
