// var baseurl = 'http://wx.cijievip.com/api/';//正式地址
var baseurl = 'http://j.jianghairui.com/api/'; //加工宝
var mobileReg = /^1\d{10}$/gi; //手机正则
var id_card = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;//身份证正则
// var puplic_url = 'http://kindapp.w.bronet.cn/A6079080424317/web_adapter/adapter.html';
// var goodUrl = 'http://kindapp.w.bronet.cn/A6079080424317/'; //测试域名
// var goodUrl = 'http://wx.cijievip.com/A6079080424317/';//正式域名
var imgUrl = 'http://j.jianghairui.com/';

// var ERROR = '';


function ApiAjax(url, subDatas, callbackfun, file, type, post) {
    file = file || {};
    type = type ? type : false;
    post = post ? post : 'post';
    if (type) {
        api.ajax({
            url: baseurl + url,
            method: post,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {
                body: subDatas
            }
        }, function (ret, err) {
            if (ret.code == -3 || ret.code == 5) {
                $api.rmStorage('fac_token');
                openView('login', 'login/login', '账号登录')
            } else {
                callbackfun(ret, err);
            }
        })
    } else {
        api.ajax({
            url: baseurl + url,
            method: post,
            timeout: 1000,
            data: {
                values: subDatas,
                files: file
            }
        }, function (ret, err) {
            // alert(JSON.stringify(ret))
            if (!ret) {
                toastMsg('网络错误');
                api.sendEvent({
                    name: 'neterror',
                });
                return
            }
            if (ret.code == -3 || ret.code == 5) {
                $api.rmStorage('fac_token');
                openView('login', 'login/login', '账号登录')
            } else {
                callbackfun(ret, err);
            }
        });
    }

}

function getreload() {
    window.location.reload();
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
        reload: true,
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
        api.closeFrame({
            name: winName
        });
    } else {
        api.closeWin({
            animation: "reveal"
        });
        api.closeFrame({
            animation: "reveal"
        });
    }

}

function getHeight(id) {
    return document.getElementById(id).offsetHeight;
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
    return parseInt(RegExp.$1) || 0;
}


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

//
// function getRequest(type = 'post', url, params) {
//     var promise = new Promise(function (resolve, reject) {
//         axios({
//             url: baseurl + url,
//             method: type,
//             data: params,
//             headers: {
//                 // 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }).then(function (res) {
//             if (res.data.code == 502) {
//                 api.openWin({
//                     name: 'login',
//                     url: 'widget://html/login/login.html',
//                 });
//             } else {
//                 resolve(res);
//                 // loadEnd();
//             }
//             // resolve(res)
//         }).catch(function (err) {
//             toastMsg('网络错误');
//             reject(err)
//         })
//     });
//     return promise
// }




