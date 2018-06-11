/*此文件为项目公用js*/

//没有成功加载本地jquery时加载在线jquery库
if(!$) {
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"><\/script>');
}

/* 初始化操作 */
$(function() {
	//请求地址白名单列表
	$.getJSON('/hfk/public/links.json', function(data, status, xhr) {
		console.log(data);
		if(status == 'success') {
			//对页面绑定的href进行过滤（不包含JS的自定义绑定）
			$('[href]').on('click', function(e) {
				var link = $(this).attr('href');
				var linkStatus = null;
				for(obj in data) {
					if(link.match(data[obj].value + '.' + data[obj].ext)) {
						linkStatus = 'normal';
						break;
					}
				}
				if(linkStatus != 'normal') {
					//阻止浏览器默认跳转
					e.preventDefault();
					//重定向到404页面
					location.href = '/hfk/page/404.html';
					//alert('未知错误');
				}
			})
		} else {
			console.warn('请求异常，404引导功能目前不可用！');
		}
	})

})

/* 获取地址栏参数 */
function GetQueryString(url, name) {
	//获取地址栏参数正则
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var ls = url.split('?')[1] || '';
	var r = ls.match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/*
 * 全局ajax
 * */
function sendAjax(url, type, param, showFlag, succCallBack, errCallBack, complete) {
	//暂时不加加载动画(暂无素材)
	function loadingAnime() {

	}
	if(!url) {
		mui.toast('请求地址为空');
		return false;
	}

	if(!type) {
		mui.toast('请求类型为空');
		return false;
	}

	//发送前
	var beforeSend = function(request) {
		//加载动画
		if(showFlag === 0) {
			loadingAnime('show');
		}
	}

	//成功回调
	if(typeof succCallBack != 'function') {
		succCallBack = function() {
			mui.toast('成功回掉函数未定义');
		}
	}
	var doSuccCallBack = function(res) {
		if(!res) {
			mui.toast('返回为空');
			return false;
		} else if(typeof(res) === 'string') {
			res = JSON.parse(res);
		}
		succCallBack(res);
	}

	//完成
	var doComplete = function() {
		if(showFlag === 0) {
			loadingAnime('remove');
		}
	}
	if(typeof complete === "function") {
		doComplete = function() {
			complete(data);
			if(showFlag === 0) {
				loadingAnime('remove');
			}
		}
	}

	//失败
	var doErrCallBack = function(xhr) {
		console.warn(xhr);
		console.warn('xhr状态' + xhr.status);
		console.warn('报错信息' + xhr.response);
	}
	if(typeof errCallBack === 'function') {
		doErrCallBack = function(xhr) {
			console.log(xhr);
			console.log('xhr状态' + xhr.status);
			console.log('报错信息' + xhr.response);
			errCallBack(xhr);
		}
	}

	//本地json文件调试
	if(url.match('.json')) {
		mui.getJSON(url, null, doSuccCallBack);
		return false;
	}

	if(mui) {
		mui.ajax(url, {
			data: param,
			dataType: 'json', //服务器返回json格式数据
			type: type, //HTTP请求类型
			timeout: 15000, //超时时间设置为10秒；
			headers: {
				//			"Access-Control-Allow-Origin": "*",
				//			"Access-Control-Allow-Headers": "X-Requested-With",
				//			"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
				//			"X-Powered-By": ' 3.2.1',
				//			"Access-Control-Max-Age": 0,
				'Content-Type': 'application/json;charset=utf-8'
			},
			beforeSend: beforeSend,
			complete: doComplete,
			success: doSuccCallBack,
			error: doErrCallBack
		});
	} else {
		$.ajax(url, {
			data: param,
			dataType: 'json', //服务器返回json格式数据
			type: type, //HTTP请求类型
			timeout: 15000, //超时时间设置为10秒；
			contentType: 'application/json;charset=utf-8',
			beforeSend: beforeSend,
			complete: doComplete,
			success: doSuccCallBack,
			error: doErrCallBack
		});
	}
}