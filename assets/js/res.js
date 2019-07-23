var isAndroid = (/android/gi).test(navigator.appVersion);

var statusBarHeight = 0;
window.onload = function(){
	var el = $('header');
	if(!el){
		return;
	}
	if(!isAndroid){//ios沉浸式
		statusBarHeight = 20;
		el.style.paddingTop = '20px';
		return;
	}
	var u = navigator.userAgent;
	var ver = parseFloat(u.substr(u.indexOf('Android') + 8, 3));
    if(ver >= 4.4){//android沉浸式
    	statusBarHeight = 25;
        el.style.paddingTop = '25px';
    }
    if(window.domReady){
		domReady();
	}
}

function $(id){
	return document.getElementById(id);
}
/**打开window
	url：打开window将加载的url
	name：window的名称
	ott：api.openWin中支持的其他参数
**/
function GotoWin(_url, name, ott){
	if(!_url){
		return;
	}
	if(!name){
		name = _url;
	}
	var args = {
		name:name, 
		url:_url,
		pageParam:{
			key:'value',
			key1:'value1'
		}
	}
	if(ott){
		for(var i in ott){
			args[i] = ott[i];
		}
	}
	api.openWin(args);
}
//window + frame窗口结构中，打开content区域所在的frame
function openContent(_url, fname, frect){
	if(!_url){
		return;
	}
	var fn = fname ? fname : 'content_frm';
	var fr = {};//frame所在的rect区域
	if(frect){
		fr = frect;
	}else{
		var headerH = 44;//header高度为api.css样式中声明的44px
		var footerH = 30;//footer高度为api.css样式中声明的30px
		fr.marginTop = headerH + statusBarHeight
		fr.marginBottom = footerH;
	}
    api.openFrame({
        name: fn,
        url: _url,
        bounces: false,
        rect: fr,
        overScrollMode:'scrolls'
    });
}
//当前系统时间戳，毫秒
function curtime(){
	return new Date().getTime();
}

function apialert(_msg, callback){
	api.alert({
	    title: '提示',
	    msg: _msg,
	}, function(ret, err) {
		if(callback){
			callback();
		}
	});
}

function toast(_msg){
	api.toast({
	    msg: _msg,
	    global: true
	});
}

function radioValue(ename){
	var radios = document.getElementsByName(ename);
	if(radios){
		for(var r in radios){
			if(radios[r].checked){
				return radios[r].value;
			}
		}
	}
}

function selectValue(eid){
	return $(eid).value;
}

function hasPermission(one_per){
	var perms = new Array();
	if(one_per){
		perms.push(one_per);
	}else{
		var prs = document.getElementsByName("p_list");
		for(var i = 0; i < prs.length; i++){
			if(prs[i].checked){
				perms.push(prs[i].value);
			}
		}
	}
	var rets = api.hasPermission({
		list:perms
	});
	if(!one_per){
		apialert('判断结果：' + JSON.stringify(rets));
		return;
	}
	return rets;
}

function reqPermission(one_per, callback){
	var perms = new Array();
	if(one_per){
		perms.push(one_per);
	}else{
		var prs = document.getElementsByName("p_list_r");
		for(var i = 0; i < prs.length; i++){
			if(prs[i].checked){
				perms.push(prs[i].value);
			}
		}
	}
	api.requestPermission({
		list: perms,
		code: 100001
	}, function(ret, err){
		if(callback){
			callback(ret);
			return;
		}
		var str = '请求结果：\n';
		str += '请求码: ' + ret.code + '\n';
		str += "是否勾选\"不再询问\"按钮: " + (ret.never ? '是' : '否') + '\n';
		str += '请求结果: \n';
		var list = ret.list;
		for(var i in list){
			str += list[i].name + '=' + list[i].granted + '\n';
		}
		apialert(str);
		console.log(JSON.stringify(ret));
	});
}

function opWithPermission(perm){
	if(!confirmPer(perm)){
		return;
	}
	if('calendar' == perm){
		//操作日历
	}else if('camera' == perm){
		api.getPicture({
			sourceType: 'camera',
			mediaValue: 'pic',
			destinationType: 'url',
		}, function(ret, err) {
			if (ret) {
				apialert(JSON.stringify(ret));
			} else {
				apialert(JSON.stringify(err));
			}
		});
	}else if('contacts' == perm){
		api.openContacts({
			test: true
		}, function(ret, err) {
			if (ret && ret.status) {
				apialert(JSON.stringify(ret));
			} else {
				apialert(JSON.stringify(err));
			}
		});
	}else if('location' == perm){
		api.getLocation(function(ret, err) {
			if (ret && ret.status) {
				apialert(JSON.stringify(ret));
			} else {
				apialert(JSON.stringify(err));
			}
		});
	}else if('microphone' == perm){
		api.startRecord({
			path: 'fs://perm-test.amr'
		});
	}else if('phone' == perm){
		api.call({
			type: 'tel',
			number: '10086'
		});
	}else if('sensor' == perm){
		//操作身体传感器
	}else if('sms' == perm){
		api.sms({
			numbers: ['10086'],
			text: '余额',
			silent: true
		});
	}else if('storage' == perm){
		api.readFile({
			path:'fs://test.txt'
		}, function(ret, err) {
			if (ret.status) {
				console.log('readFile: ' + ret.data);
			} else {
				apialert(err.msg + ": \n" + api.fsDir);
			}
		});
	}
}

function confirmPer(perm){
	var has = hasPermission(perm);
	if(!has || !has[0] || !has[0].granted){
		api.confirm({
			title: '提醒',
			msg: '没有获得 ' + perm + " 权限\n是否前往设置？",
			buttons: ['去设置', '取消']
		}, function(ret, err) {
			if(1 == ret.buttonIndex){
				reqPermission(perm);
			}
		});
		return false;
	}
	return true;
}