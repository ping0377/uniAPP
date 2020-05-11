<template>
	<view class="content">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="input-group">
			<!-- #ifdef APP-PLUS || MP-WEIXIN -->
			<!-- <view class="input-row border">
				<text class="title">单位：</text>
				<m-input class="m-input" type="text" clearable v-model="units" placeholder="请输入单位编号"></m-input>
				<button type="primary" class="mini-btn" size="mini" @tap="setUnit">设定</button>
			</view> -->
			<!-- #endif -->
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable v-model="account" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="Login">登录</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input/m-input.vue'
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				account: "",
				password: "",
				units: "",
				disabled: false,
				stoUrl: ""
			}
		},
		onLoad() {
			//#ifdef H5
			// requests.Prompt()
			//#endif
		},
		onShow() {
			variable.that = this
			// #ifdef APP-PLUS || MP-WEIXIN
			variable.HTTP = ""
			uni.getStorage({
					key: "unitNum",
					success: function(res) {
						if (res.data != "" && res.data) {
							variable.that.units = res.data
							variable.that.disabled = true
						} else {
							variable.that.disabled = false
						}
					}
				}),
				uni.getStorage({
					key: "HTTP",
					success: function(res) {
						variable.HTTP += res.data
					}
				})
			//#endif
		},
		methods: {
			//#ifdef APP-PLUS || MP-WEIXIN
			getstor() {
				uni.getStorage({
					key: "HTTP",
					success: function(res) {
						variable.that.stoUrl = res.data
					}
				})
			},
			//#endif
			Login() {
				if (this.account == "" || this.password == "") {
					this.$refs.anRef.show("账号密码不能为空", {
						type: "error"
					})
					return
				}
				let Data = {
					WorkerNo: this.account,
					Pwd: this.password
				};
				let login = JSON.stringify(Data)
				let loginurl = "api/Applet.ashx?Function=HttpVirtualLogin"
				requests.bindLogin(login,loginurl).then(res => {
					if (res.data.State == "成功") {
						uni.setStorage({
							key: "ClientAddr",
							data: res.data.ClientAddr
						});
						this.$refs.anRef.show("登录成功", {
							type: "success"
						});
						variable.shop = res.data.Body[0]
						variable.account = this.account
						this.password = ""
						uni.switchTab({
							url: '../index/index'
						})
					} else {
						this.$refs.anRef.show("登录失败,请检查账号密码", {
							type: "error"
						});
					}
				}, error => {
					console.log(error)
				})
			},
			//#ifdef APP-PLUS || MP-WEIXIN
			setUnit() {
				variable.HTTP = "http://"
				if (!this.units) {
					this.$refs.anRef.show('请输入正确的单位编号', {
						type: "error"
					});
					return;
				}
				let Data = {
					No: this.units
				}
				requests.crossPost('http://yunxiyigl.fryxy.cn/api/XiYiManager.ashx?Function=HttpQueryHost', JSON.stringify(Data)).then(
					res => {
						if (res.data.State == "成功" && res.data.Body) {
							variable.HTTP += (res.data.Body + "/")
							uni.setStorage({
								key: "HTTP",
								data: variable.HTTP
							});
							uni.setStorage({
								key: "unitNum",
								data: this.units
							});
							this.$refs.anRef.show("单位编号设定成功", {
								type: "success"
							})
							// uni.redirectTo({
							// 	url: '../Login/Login'
							// })
						} else {
							this.$refs.anRef.show("该编号有误,检查编号是否正确", {
								type: "warn"
							})
							return
						}
					}, error => {
						console.log('失败' + error)
					})
			}
			//#endif
		}
	}
</script>

<style>
	/* #ifdef H5 */
	page {
		height: -webkit-calc(100vh - 44px);
		height: -moz-calc(100vh - 44px);
		height: calc(100vh - 44px);
		display: flex;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN || APP-PLUS */
	page {
		height: 100vh;
		display: flex;
	}

	/* #endif */

	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding-top: 30upx;
	}

	.input-group {
		background-color: #ffffff;
		margin: 60upx 20upx 25upx 20upx;
		position: relative;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	/* #ifdef H5 */
	.input-row .title {
		width: 13%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	/* #endif */
	/* #ifdef APP-PLUS || MP-WEIXIN */
	.input-row .title {
		width: 20%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	/* #endif */

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}

	button.primary {
		background-color: #0faeff;
	}

	.input-row .mini-btn {
		width: 150rpx;
		height: 75rpx;
		line-height: 3.2;
		padding: 0 0.5em;
	}
</style>
