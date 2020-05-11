// #ifdef H5
import jweixin from '../jweixin/index.js'
// #endif
import variable from '../common/variable.js'

//单位编号对应的域名

//登录
export async function bindLogin(user, loginurl) {
	//#ifdef APP-PLUS || MP-WEIXIN
	if (variable.HTTP == "http://" || variable.HTTP == "") {
		variable.that.$refs.anRef.show("请先设定单位编号", {
			type: "warn"
		})
		uni.redirectTo({
			url: '/pages/pagehome/pagehome'
		});
		return
	}
	//#endif
	let httplogin = {
		url: variable.HTTP + loginurl,
		method: "POST",
		data: {
			Data: user
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httplogin).then(
			(res) => {
				resolve(res[1])
			}
		).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
}


//复用方法(修改密码，所有收衣点，登录店铺全部订单……)
export async function multiplexFun(client, inc, askURL) {
	if (variable.HTTP == "http://" || variable.HTTP == "") {
		//#ifdef APP-PLUS || MP-WEIXIN
		variable.that.$refs.anRef.show("请先设定单位编号", {
			type: "warn"
		})
		uni.redirectTo({
			url: '/pages/pagehome/pagehome.vue'
		});
		return
		//#endif
	} else {
		let revisepwd = {
			url: variable.HTTP + askURL,
			method: "POST",
			data: {
				Data: inc,
				ClientAddr: client
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}
		let promise = new Promise(function(resolve, reject) {
			uni.request(revisepwd).then(
				(res) => {
					resolve(res[1])
				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
	}
}

//返回登录界面
export async function toLogin() {
	uni.reLaunch({
		url: '../Login/Login'
	})
}

//获取指定时间
export async function getStartDate(dateScope) {
	let date = new Date
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let startdate
	if (dateScope == "day") { //当天时间
		startdate = year + "-" + month + "-" + day
	} else if (dateScope == "week") { //一周前
		if (day < 8) {
			let oneweekdate = new Date(date - 7 * 24 * 3600 * 1000)
			year = oneweekdate.getFullYear();
			month = oneweekdate.getMonth() + 1;
			day = oneweekdate.getDate();
			startdate = year + "-" + month + "-" + day
		} else {
			startdate = year + "-" + month + "-" + (day - 7)
		}
	} else if (dateScope == "month") { //一月前
		if (month != 1) {
			startdate = year + "-" + (month - 1) + "-" + day
		} else {
			startdate = (year - 1) + "-" + 12 + "-" + day
		}
	} else { //一年前
		startdate = (year - 1) + "-" + month + "-" + day
	}
	return startdate
}

//单位编号设定
export async function crossPost(url, inc) {
	let option = {
		url: url,
		method: "POST",
		data: {
			Data: inc
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(option).then(
			(res) => {
				resolve(res[1])
			}
		).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
}
//获取扫码配置信息
//#ifdef H5
export async function getConfig(client, inc) {
	let [error, res] = await uni.request({
		url: "http://weilang.fryxy.cn/api/WeChatUser.ashx?Function=HttpGetSign",
		method: 'POST',
		data: {
			Data: inc,
			ClientAddr: client
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
	let s = res.data.Body
	console.log(s)
	jweixin.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: s.appId, // 必填，公众号的唯一标识
		timestamp: s.config_timestamp, // 必填，生成签名的时间戳
		nonceStr: s.config_nonceStr, // 必填，生成签名的随机串
		signature: s.config_signature, // 必填，签名
		jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
	});
}
//#endif

export async function Prompt() {
	if (uni.getSystemInfoSync().platform === "other") {
		uni.reLaunch({
			url: "../prompt/prompt"
		})
	}
}
