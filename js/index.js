var marquee; //声明变量

//无缝滚动
function marqueeStart(i, direction) {
	marquee = function(i, direction) {
		var obj = document.getElementById("marquee" + i);
		var obj1 = document.getElementById("marquee" + i + "_1");
		var obj2 = document.getElementById("marquee" + i + "_2");
		if(direction == "up") {
			if(obj2.offsetTop - obj.scrollTop <= 0) {
				obj.scrollTop -= (obj1.offsetHeight + 20);
			} else {
				var tmp = obj.scrollTop;
				obj.scrollTop++;
				if(obj.scrollTop == tmp) {
					obj.scrollTop = 1;
				}
			}
		} else {
			if(obj2.offsetWidth - obj.scrollLeft <= 0) {
				obj.scrollLeft -= obj1.offsetWidth;
			} else {
				obj.scrollLeft++;
			}
		}
	}

	var obj = document.getElementById("marquee" + i);
	var obj1 = document.getElementById("marquee" + i + "_1");
	var obj2 = document.getElementById("marquee" + i + "_2");

	obj2.innerHTML = obj1.innerHTML;
	var marqueeVar = window.setInterval("marquee(" + i + ", '" + direction + "')", 20);
	obj.onmouseover = function() {
		window.clearInterval(marqueeVar);
	}
	obj.onmouseout = function() {
		marqueeVar = window.setInterval("marquee(" + i + ", '" + direction + "')", 20);
	}
}

//页面初始化操作
$(function() {
	//首页色块默认选中
	$('.nav-item').first().css('background-color', 'green');
	//鼠标悬停选中导航块
	$('.nav-item').on('mouseover', function() {
		$(this).siblings().css('background', 'none');
		$(this).css('background-color', 'green');
	})
	//百叶窗轮播
	$('.shutter').shutter({
		shutterW: document.body.clientWidth, // 容器宽度
		shutterH: 600, // 容器高度
		isAutoPlay: true, // 是否自动播放
		playInterval: 3000, // 自动播放时间
		//curDisplay: 0, // 当前显示页
		fullPage: false // 是否全屏展示
	});
	//当窗口变化时重新初始化轮播元素及组件(自适应窗口)
	window.onresize = function() {
		//克隆一份shutter-clone
		var html = $('.shutter-clone').clone();
		//将克隆的shutter-clone类名变为shutter
		html.attr('class', 'shutter');
		//将原shutter删除
		$('.shutter').remove();
		//将变更为shutter类名的克隆体重新添加
		$('.slider-area').append(html);
		//重新在克隆体上绑定百叶窗轮播
		$('.shutter').shutter({
			shutterW: document.body.clientWidth, // 容器宽度
			shutterH: 600, // 容器高度
			isAutoPlay: true, // 是否自动播放
			playInterval: 3000, // 自动播放时间
			//curDisplay: 0, // 当前显示页
			fullPage: false // 是否全屏展示
		});
	}
	//无缝滚动初始化
	marqueeStart(1, "left");
	//鼠标进入 翻转卡片
	$('.news-area .board img').on('mouseenter', function() {
		var card = $(this);
		card.addClass('flip');
		setTimeout(function() {
			card.removeClass('flip');
		}, 600)
	})
})