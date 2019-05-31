function $(select) {
	return document.querySelector(select);
}
function $$(select) {
	return document.querySelectorAll(select);
}

var audioObj = new Audio();
var sortInt = 0;
var musicObj = [];
var setTime;

//通过ajax获取json数据
function getMusiclist(callee){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://gao182.github.io/website-test/musicPlayer/css/intor.json', true);
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


//建立操作音乐的函数，在数据获得后执行
getMusiclist(function(listObj){
	musicObj = listObj;
	loadMusic(musicObj[sortInt]);
	musicList(musicObj);

	//页面加载后第一个数据
	$('.musiclist .list-item .name').innerText = musicObj[0]['name'];
	$('.musiclist .list-item .writer').innerText = musicObj[0]['writer'];

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
});

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
		$$('.list-item .iconfont')[i].classList.replace('icon-play', 'icon-pause');
	}
	$$('.list-item')[sortInt].classList.add('active');
	$$('.list-item .iconfont')[sortInt].classList.replace('icon-pause', 'icon-play');

	//定时器，每0.2s执行一次
	setTime = setInterval(function(){
		$('.music-footer .timeline .time').innerText = countTimes(audioObj.currentTime);
		$(".timeline .progress-now").style.width = Math.floor(audioObj.currentTime/audioObj.duration * 100) + '%';
		setCss3($('.content .poster').style, audioObj.currentTime);
	}, 1000);
}

//旋转光碟
function setCss3(tag, time){
	var rotate = "rotate("+ (20 * time) +"deg)";
	
	tag["transform"] = rotate;
	tag["-ms-transform"] = rotate;
	tag["-moz-transform"] = rotate;
	tag["-webkit-transform"] = rotate;
	tag["-o-transform"] = rotate;

	tag["transition-duration"] = "1s";
	tag["-moz-transition-duration"] = "1s";
	tag["-webkit-transition-duration"] = "1s";
	tag["-o-transition-duration"] = "1s";

	tag["transition-timing-function"] = "linear";
	tag["-moz-transition-timing-function"] = "linear";
	tag["-webkit-transition-timing-function"] = "linear";
	tag["-o-transition-timing-function"] = "linear";
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
	if (e.target.classList.contains('list-item')) {
		sortInt = e.target.firstElementChild.innerText - 1;
	}
	else if (e.target.classList.contains('sort')) {
		sortInt = e.target.innerText - 1;
	}
	else if (e.target.classList.contains('name')) {
		sortInt = e.target.offsetParent.firstElementChild.innerText - 1;
	}
	else if (e.target.classList.contains('writer')) {
		sortInt = e.target.offsetParent.firstElementChild.innerText - 1;
	}
	else if (e.target.classList.contains('iconfont')) {
		sortInt = e.target.offsetParent.offsetParent.firstElementChild.innerText - 1;
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

	//从第二个开始的数据
	for (var i =  1 ; i < musicObj.length; i++) {
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


