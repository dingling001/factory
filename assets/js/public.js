// var baseurl = 'http://wx.cijievip.com/api/';//正式地址
var baseurl = 'http://j.jianghairui.com/api/'; //加工宝
var mobileReg = /^1\d{10}$/gi; //手机正则
var id_card = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;//身份证正则
// var goodUrl = 'http://localhost:8080/A6079080424317/html/';//公众号域名
var puplic_url = 'http://kindapp.w.bronet.cn/A6079080424317/web_adapter/adapter.html';
// var goodUrl = 'http://kindapp.w.bronet.cn/A6079080424317/'; //测试域名
var goodUrl = 'http://wx.cijievip.com/A6079080424317/';//正式域名
var imgUrl = 'http://j.jianghairui.com/';
var ERROR = '';

function openWin(winName, url) {
    api.openWin({
        name: winName,
        url: url
    });
}

function ApiAjax(url, subDatas, callbackfun, file = {}) {
    // console.log(url);
    // console.log(JSON.stringify(subDatas));
    // console.log(callbackfun);
    api.ajax({
        url: baseurl + url,
        method: 'post',
        timeout: 1000,
        data: {
            values: subDatas,
            files: file
        }
    }, function (ret, err) {
        if (ret.code == -3 || ret.code == 5) {
            $api.rmStorage('fac_token');
            openView('login', 'login/login', '账号登录')
        } else {
            callbackfun(ret, err);
        }
    });
}

function offline() {
    api.addEventListener({
        name: 'offline'
    }, function (ret, err) {
        return true
    });
}

function openView(fmName, fmUrl, winTitle, winName, winUrl, fmParams, winParams) {
    var options = {
        name: '',
        url: '',
        pageParam: {
            winTitle: '',
            win: {},
            fmName: '',
            fmUrl: '',
            fm: {},
        },
        slidBackEnabled: false
    };
    options.pageParam.fmName = fmName;
    options.pageParam.fmUrl = 'widget://html/' + fmUrl + '.html';
    if (winName) {
        options.name = winName;
    } else {
        options.name = fmName;
    }
    if (winUrl) {
        options.url = 'widget://html/' + winUrl + '.html';
    } else {
        options.url = 'widget://html/common/win/win.html';
    }
    options.pageParam.winTitle = winTitle || '';
    options.pageParam.winTitle = winTitle;
    if (winParams) {
        options.pageParam.win = winParams;
    }
    if (fmParams) {
        options.pageParam.fm = fmParams;
    }
    api.openWin(options);
}

function closeWindow(winName) {
    if (winName) {
        api.closeWin({
            name: winName,
            animation: "reveal"
        });
    } else {
        api.closeWin({
            animation: "reveal"
        });
    }
}

function getHeight(id) {
    return document.getElementById(id).offsetHeight;
}


function openFm(fmName, url) {
    var posY = $api.offset($api.dom("header")).h;
    var fmUrl = url ? url : fmName + "_fm.html";
    api.openFrame({
        name: fmName,
        url: fmUrl,
        rect: {
            x: 0,
            y: posY
        },
        bounces: true,
        hScrollBarEnabled: false,
        vScrollBarEnabled: false
    });
}

function toastMsg(msg) {
    api.toast({
        msg: msg,
        duration: 2000,
        location: "middle"
    });
}

// 双击退出
function exit_app() {
    var appId = api.appId;
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.toast({
            msg: '再按一次返回键退出' + api.appName,
            duration: 2000,
            location: 'bottom'
        });
        api.addEventListener({
            name: 'keyback'
        }, function (ret, err) {
            api.closeWidget({
                id: appId,     //应用ID
                retData: {name: 'closeWidget'},
                silent: true
            });
        });
    });
}

function fixStatusBar(t) {
    var e = api.systemType;
    if ("ios" == e) fixIos7Bar(t);
    else if ("android" == e) {
        var a = api.systemVersion;
        a = parseFloat(a), a >= 4.4 && (t.style.paddingTop = "1.36rem", t.style.height = "3.56rem", t.style.lineHeight = "2.2rem");
    }
}

function fixIos7Bar(t) {
    var e = api.systemType;
    if ("ios" == e) {
        var a = api.systemVersion,
            n = parseInt(a, 10),
            i = api.fullScreen,
            o = api.iOS7StatusBarAppearance;
        n >= 7 && !i && o && (t.style.paddingTop = "1rem", t.style.height = "3.2rem")
    }
}

function getToken() {
    if ($api.getStorage('fac_token')) {
        return $api.getStorage('fac_token')
    } else {
        return null;
    }
}


function isLogin(_this, callback) {
    Vue.http.options.emulateJSON = true;
    var logpost = {
        cmd: 'u_checkTokenIsRight',
        token: getToken()
    };
    console.log(baseUrl)
    _this.$http.post(baseUrl + 'Api/Init/', logpost).then(function (res) {
        if (res.data.code == 1) {
            callback(true);
        } else {
            callback(false);
        }
    }, function () {
        toastMsg('网络小短腿跑不动了...');
        api.refreshHeaderLoadDone();
        // api.addEventListener({
        //   name:'loadfailed'
        // });
        losenet(function () {
            location.reload();
        });
    });
}

function loadEnd() {
    var ele = document.getElementById('loadStart');
    var app = document.getElementById('app');
    if (ele && app) {
        ele.style.opacity = 0;
        app.style.overflow = 'hidden';
        setTimeout(function () {
            ele.style.display = "none";
            app.style.overflow = 'auto';
        }, 1000);
    }
}

function getcity() {
    if ($api.getStorage('city')) {
        return $api.getStorage('city')
    } else {
        return null;
    }
}

//content转化为html
function charToHtml(str) {
    if (str) {
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, "'");
        str = str.replace(/&#039;/g, ' ');
    }
    return str;
}

//我的-头像显示
refresh = function (callback) {
    api.setRefreshHeaderInfo({
        bgColor: '#eee',
        textColor: '#000',
        textDown: '下拉刷新...',
        textUp: '松开刷新...'
    }, function () {
        callback();
    });
};

function getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
        return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
}

function getImageSizeInBytes(imgURL) {
    console.log("getImageSizeInBytes imgURL： " + imgURL);
    var request = new XMLHttpRequest();
    request.open("HEAD", imgURL, false);
    request.send(null);
    var headerText = request.getAllResponseHeaders();
    var re = /Content\-Length\s*:\s*(\d+)/i;
    re.exec(headerText);
    return parseInt(RegExp.$1);
}

refreshDone = function (mess) {
    if (mess) {
        toastMsg(mess);
    }
    setTimeout(function () {
        api.refreshHeaderLoadDone();
    }, 500)
};

// 图片分享
function formatShareImg(imgUrl) {
    if (imgUrl) {
        imgUrl = imgUrl.split(',')[0];
        if (imgUrl.indexOf('http') !== 0) {
            imgUrl = baseUrl + imgUrl;
        }
    } else {
        imgUrl = baseUrl + '/Public/applogo.png';
    }

    return imgUrl;
}


// function data_string(str, value) {
//     if (value == "yyyy-MM-dd hh:mm:ss") {
//         var d = eval('new ' + str.substr(1, str.length - 2));
//         var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
//         for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
//         return ar_date.slice(0, 3).join('-') + ' ' + ar_date.slice(3).join(':');
//         function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
//     }
//     else if (value == "yyyy-MM-dd") {
//         var d = eval('new ' + str.substr(1, str.length - 2));
//         var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
//         for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
//         return ar_date.join('-');
//         function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
//     }
// }

function add0(num) {
    if (num) {
        num = parseInt(num);
        if (num >= 10) {
            return num
        } else {
            return '0' + num
        }
    } else {
        return "00"
    }
}

function timestampToTime(timestamp, type) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (type) {
        return Y + M + D
    } else {
        return Y + M + D + h + m;
    }

}

function checkDate(date, type) {
    if (date == '') {
        return false;
    } else {
        var day = new Date();
        var da = new Date(date.replace(/-/g, '/'));
        var startDate = day.getTime();
        var endDate = da.getTime();
        var ms = endDate - startDate
        var dates = Math.floor(ms / 1000 / 60 / 60);
        if (type == 1) {
            if (dates < 3 || dates > 171) {
                return false;
            } else {
                return true;
            }
        } else if (type == 3) {
            if (dates < 72) {
                return false;
            } else {
                return true;
            }
        } else {
            return startDate - endDate < 0;
        }

    }
}

function getTimeDetil(num) {
    var date = new Date();
    var Y, M, D, h, m, s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + num + ':';
    m = date.getMinutes();
    s = date.getSeconds();
    if ((date.getHours() + num) > 24) {
        h = '0' + (date.getHours() + num) % 24 + ':';
        D = parseInt(D) + Math.floor((date.getHours() + num) / 24) + ' ';
    }
    return Y + M + D + h + m
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function toWan(str) {
    var str = parseFloat(str);
    if (str > 9999) {
        return (str / 1e4) + '万'
    } else {
        return str
    }
}

function getRequest(type = 'post', url, params) {
    var promise = new Promise(function (resolve, reject) {
        axios({
            url: baseurl + url,
            method: type,
            data: params,
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (res) {
            if (res.data.code == 502) {
                api.openWin({
                    name: 'login',
                    url: 'widget://html/login/login.html',
                });
            } else {
                resolve(res);
                // loadEnd();
            }
            // resolve(res)
        }).catch(function (err) {
            toastMsg('网络错误');
            reject(err)
        })
    });
    return promise
}

//设备判断
function getDevice() {
    var login_device = '';
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var wx = sUserAgent.match(/MicroMessenger/i) == "micromessenger"
    var mac = sUserAgent.match(/macintosh|mac os x/i) == "mac"
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        var UA = window.navigator.userAgent;

        isAndorid = /android/i.test(UA),
            isIphone = /iphone/i.test(UA),
            //isIphone = /(?:iPhone)/.test(UA),
            isPad = /ipad/i.test(UA),
            isDolphin = typeof dolphin !== 'undefined';
        device = isAndorid ? 'android' : isIphone ? 'iphone' : isPad ? 'ipad' : mac ? 'mac' : 'mobile';
        switch (device) {
            case 'iphone':
                login_device = device;
                break;
            case 'android':
                login_device = device;
                break;
            case 'ipad':
                login_device = device;
                break;
            default:
                login_device = device;
                break;
        }
    } else {
        pc_device = wx ? 'wx' : mac ? 'mac' : 'pc'
        login_device = pc_device;
    }
    return login_device
}

// 动态环
function giftCircleProgressFn(per) {
    var circleData = {};
    var percent = parseInt(per);
    //领取进度环形颜色className
    var halfClassName = percent < 50 ? "little" : "more";
    //左半环遮罩层显示样式状态
    var leftCircleDisplay = percent < 50 ? "block" : "none";
    var leftRotate = 0;
    var rightRotate = 0;
    //以50%为界限;<50%:右半圆占比为0,左半圆需要使用遮罩进行遮挡,展示剩余部分
    //           >50%:左半圆占比100%,右半圆直接使用百分比计算所占部分即可
    //注意：在半圆中计算百分比时,要将百分比乘以2。
    if (percent < 50) {
        leftRotate = -15 - 180 + 150 * (percent * 2) / 100;
        rightRotate = -135;
    } else {
        leftRotate = -15;
        rightRotate = -135 + (150 * ((percent - 50) * 2) / 100);   //比例在半环计算需要*2倍
    }
    circleData = {
        leftRotate: leftRotate,  //左半环进度
        rightRotate: rightRotate, //右半环进度
        halfClassName: halfClassName, //50% 进度环 变色
        leftCircleDisplay: leftCircleDisplay, //左半环遮罩
        percent: per  //进度百分比
    }
    return circleData
}

function escape2Html(str) {
    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
        return arrEntities[t];
    });
}

