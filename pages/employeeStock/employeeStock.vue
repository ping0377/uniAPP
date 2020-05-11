<template>
	<view class="alldata">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="sweep_code">
			<view class="sweep_code_data">
				<input placeholder="请输入预约单号,或扫码" v-model="orderNo" @blur="getInfo" />
				<button @tap="existFruit">确定</button>
				<!-- #ifdef APP-PLUS || MP-WEIXIN -->
				<text class="iconfont uni-bold" @tap="sweepCode">&#xe624;</text>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<text class="iconfont uni-bold" @tap="sweepCodeh5">&#xe624;</text>
				<!-- #endif -->
			</view>
		</view>
		<view class="exist_view">
			<view class="exist_info">
				<view class="">
					<text>预约单号：</text><text>{{orderInfo.fkReserveNo}}</text>
				</view>
				<view class="">
					<text>收取员工姓名：</text><text>{{orderInfo.name}}</text>
				</view>
				<view class="">
					<text>收取员工编号：</text><text>{{orderInfo.fkWorkerNo}}</text>
				</view>
				<view class="">
					<text class="uni-bold">取件码：</text><text class="uni-bold">{{orderInfo.code}}</text>
				</view>
				<view class="">
					<button class="uni-bold" @tap="getSackInfo">查看订单详情</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//#ifdef H5
	import jweixin from '../../jweixin/index.js'
	//#endif
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'

	export default {
		onLoad() {
			//#ifdef H5
			requests.Prompt()
			//#endif
			variable.that = this
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					variable.that.client = res.data
				}
			})
		},
		onReady() {
			//#ifdef H5
			if (uni.getSystemInfoSync().platform == "android") {
				let url = location.href
				let inc = {
					PageUrl: url
				}
				let i = JSON.stringify(inc)
				requests.getConfig(variable.that.client, i)
			}
			//#endif
		},
		data() {
			return {
				client: "",
				orderNo: "", //预约单号
				orderInfo: {}, //扫码或输入单号后台返回的信息
				skip: "../orderFormDetails/orderFormDetails?item=",
				ordinfo: true
			}
		},
		methods: {
			//确定存件
			existFruit() {
				if (this.client == "") {
					this.$refs.anRef.show("登录失效，请重新登录", {
						type: "error"
					});
					setTimeout(requests.toLogin, 1200)
				} else if (this.orderNo == "") {
					this.$refs.anRef.show("存件失败，请扫码或者输入预约单号", {
						type: "warn"
					})
					return
				}
				let Data = {
					fkReserveNo: this.orderNo
				}
				let url = "api/Applet.ashx?Function=HttpVirtualReservationDistribute"
				let inc = JSON.stringify(Data)
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.State == "成功") {
						this.$refs.anRef.show("存件成功", {
							type: "success"
						})
						this.orderInfo = res.data.Body
						this.orderInfo.state = 2
					} else if (res.data.State == "失败" && res.data.Reason.indexOf("预约单已配送") != -1) {
						this.$refs.anRef.show("存件失败，预约单已配送", {
							type: "warn"
						})
						this.orderInfo.state = 3
					} else if (res.data.State == "失败" && res.data.Reason == "缺少员工号") {
						this.$refs.anRef.show("存件失败，缺少员工号", {
							type: "warn"
						})
					} else {
						this.$refs.anRef.show("存件失败，检查订单号是否正确", {
							type: "warn"
						})
					}
				}), error => {
					console.log(error)
				}
			},
			//查看订单详情
			getSackInfo() {
				if (this.orderNo == "") {
					this.$refs.anRef.show("请先输入单号或扫码", {
						type: "warn"
					})
					return
				} else if (this.ordinfo) {
					this.$refs.anRef.show("订单号有误，请检查订单号", {
						type: "warn"
					})
					return
				}
				uni.navigateTo({
					url: this.skip + encodeURIComponent(JSON.stringify(this.orderInfo)) + '&state=' + encodeURIComponent(JSON.stringify(
						this.orderInfo.state))
				})
			},
			// 扫码
			//#ifdef APP-PLUS || MP-WEIXIN
			sweepCode() {
				uni.scanCode({
					success: function(res) {
						variable.that.orderNo = res.result
						if (variable.that.orderNo != "") {
							variable.that.orderInfo.pkNo = variable.that.orderNo
							variable.that.orderInfo.state = 1
							let Data = {
								pkNo: variable.that.orderNo
							}
							let inc = JSON.stringify(Data)
							let url = "api/WeChatUser.ashx?Function=HttpQueryReservationInfo"
							requests.multiplexFun(variable.that.client, inc, url).then(resp => {
								console.log(resp.data)
								if (resp.data.Body.length == 0) {
									variable.that.ordinfo = true
								} else {
									variable.that.ordinfo = false
								}
							}), error => {
								console.log(error)
							}
						}
						setTimeout(function() {
							variable.that.existFruit()
						}, 0)
					}
				});
			},
			//#endif
			//#ifdef H5
			sweepCodeh5() {
				jweixin.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], //可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						variable.that.orderNo = res.resultStr
						if (variable.that.orderNo != "") {
							variable.that.orderInfo.pkNo = variable.that.orderNo
							variable.that.orderInfo.state = 1
							let Data = {
								pkNo: variable.that.orderNo
							}
							let inc = JSON.stringify(Data)
							let url = "api/WeChatUser.ashx?Function=HttpQueryReservationInfo"
							requests.multiplexFun(variable.that.client, inc, url).then(resp => {
								console.log(resp.data)
								if (resp.data.Body.length == 0) {
									variable.that.ordinfo = true
								} else {
									variable.that.ordinfo = false
								}
							}), error => {
								console.log(error)
							}
						}
						setTimeout(function() {
							variable.that.existFruit()
						}, 0)
					}
				})
			},
			//#endif
			//查询输入的订单号是否有效，无效的话不允许查看订单状态
			getInfo() {
				if (this.orderNo != "") {
					this.orderInfo.pkNo = this.orderNo
					this.orderInfo.state = 1
					let Data = {
						pkNo: this.orderNo
					}
					let inc = JSON.stringify(Data)
					let url = "api/WeChatUser.ashx?Function=HttpQueryReservationInfo"
					requests.multiplexFun(this.client, inc, url).then(res => {
						if (res.data.State == "成功") {
							if (res.data.Body.length == 0) {
								this.ordinfo = true
							} else {
								this.ordinfo = false
							}
						}
					}), error => {
						console.log(error)
					}
				}
			}

		}
	}
</script>

<style>
	page {
		height: 100vh;
		background-color: #D8D8D8;
	}

	.alldata {
		padding-top: 60upx;
	}

	.sweep_code {
		margin: 0 0 20upx 20upx;
	}

	.sweep_code_data {
		position: relative;
	}

	.sweep_code_data text {
		font-size: 50upx;
		position: absolute;
		left: 425upx;
		top: -3upx;
	}

	.sweep_code .sweep_code_data input {
		width: 355upx;
		height: 80upx;
		line-height: 80upx;
		min-height: 80upx;
		border: 1px solid;
		background-color: #FFFFFF;
		display: inline-block;
		border-radius: 160upx 160upx 160upx 160upx;
		padding: 0 85upx 0 52upx;
		margin-right: 15upx;
	}

	.sweep_code_data .iconfont {
		z-index: 2;
	}

	.sweep_code button {
		display: inline-block;
		width: 200upx;
		height: 80upx;
		line-height: 80upx;
		background-color: #007AFF;
		border-radius: 160upx 160upx 160upx 160upx;
		color: #FFFFFF;
	}

	.exist_view {
		padding: 0 20upx;
	}

	.exist_info {
		background-color: #FFFFFF;
		border-radius: 26upx;
	}

	.exist_info view:nth-last-of-type(n+2) {
		border-bottom: 1px solid #D8D8D8;
		text-indent: 1em;
		height: 80upx;
		line-height: 80upx;
		font-size: 1.1em;
	}

	.exist_info button {
		background-color: #0000FF;
		color: #FFFFFF;
		border-radius: 0 0 25upx 25upx;
		margin-top: 5upx;
	}
</style>
