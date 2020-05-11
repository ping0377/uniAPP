<template>
	<view class="content">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<!-- #ifdef APP-PLUS || MP-WEIXIN -->
		<view class="input-group">
			<view class="input-row border">
				<text class="title">单位：</text>
				<m-input class="m-input" type="text" clearable v-model="units" placeholder="请输入单位编号"></m-input>
				<button type="primary" class="mini-btn" size="mini" @tap="setUnit">设定</button>
			</view>
		</view>
		<!-- #endif -->
		<view class="nav">
			<view class="nav_item" @tap="To('Login')">
				<text class="iconfont">&#xe646;</text>
			</view>
			<view class="nav_item" @tap="To('generalLogin')">
				<text class="iconfont">&#xe600;</text>
			</view>
			<view class="nav_item" @tap="To('getmsg')">
				<text class="iconfont">&#xe600;</text>
			</view>
		</view>
		<view class="nav">
			<view class="nav_str">
				<text>收衣点管理</text>
			</view>
			<view class="nav_str">
				<text>快递柜配送</text>
			</view>
			<view class="nav_str">
				<text>收衣点采集</text>
			</view>
		</view>

		<view class="nav">
			<view class="nav_item" @tap="more">
				<text>更多</text>
			</view>
			<view class="nav_item" @tap="To('Login')">
				<text class="iconfont">&#xe646;</text>
			</view>
			<view class="nav_item" @tap="To('generalLogin')">
				<text class="iconfont">&#xe600;</text>
			</view>
			
		</view>
		<view class="nav">
			<!-- <view >
				<text>期待ing</text>
			</view> -->
		<!-- 	<view >
				<text>更多</text>
			</view> -->
			<view class="nav_str">

			</view>
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
		data() {
			return {
				units: ""
			}
		},
		methods: {
			more() {
				this.$refs.anRef.show('敬请期待', {
					type: "info"
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
							console.log(res.data.Body)
							console.log(variable.HTTP)
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
						} else {
							this.$refs.anRef.show("该编号有误,检查编号是否正确", {
								type: "warn"
							})
							return
						}
					}, error => {
						console.log('失败' + error)
					})
			},
			//#endif
			To(toUrl) {
				if (variable.HTTP == "") {
					this.$refs.anRef.show("请先设置单位编号", {
						type: "warn"
					})
					return
				}
				uni.navigateTo({
					url: "../" + toUrl + "/" + toUrl
				})
			}
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
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding-top: 30upx;
	}

	.iconfont {
		font-size: 70upx;
	}

	.nav {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
	}

	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.nav_item {
		width: 25%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid;
	}

	.nav_item:hover {
		border: 1px solid #0000FF;
	}

	.nav_str {
		width: 25%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-row button,
	.input-row .title,
	.input-row input {
		display: inline-block;
		height: 1.4rem;
		line-height: 1.4rem;
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
		border-radius: 0;
	}
</style>
