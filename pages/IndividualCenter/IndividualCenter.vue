<template>
	<view>
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<uni-popup ref="popup" type="center" custom :mask-click="false">
			<view class="uni-tip">
				<view class="uni-tip-title">提示</view>
				<view class="uni-tip-content">是否退出登录？</view>
				<view class="uni-tip-group-button">
					<view class="uni-tip-button" @tap="cancelSec">取消</view>
					<view class="uni-tip-button" @tap="affirmSec">确定</view>
				</view>
			</view>
		</uni-popup>
		<view class="my_info">
			<view class="uni-bold">
				我的信息
			</view>
		</view>
		<view class="secede">
			<text @tap="secedeLogin">退出登录</text>
		</view>
		<view class="userpwd">
			<view class="user">
				<text class="iconfont circle">&#xe75d;</text>
				<text>账号：</text>
				<text>{{account}}</text>
			</view>
			<view class="pwd">
				<text class="iconfont circle">&#xe75d;</text>
				<text>密码：</text>
				<text>******</text>
				<button type="primary" size="mini" @tap="revisePwd">修改密码</button>
			</view>
		</view>
		<view class="my_cabinet uni-bold">
			<text>我的柜点</text>
		</view>
		<view class="cabint_info">
			<view class="cabint_info_data" v-for="(item,index) in cabinetPoint" :key="index">
				<navigator :url="skip+encodeURIComponent(JSON.stringify(item))">
					<view class="name-no">
						<view class="name">
							名称：{{item.name}}
						</view>
						<view class="no">
							编号：{{item.deviceID}}
						</view>
					</view>
					<view class="user_info">
						<view class="use">
							已使用：{{item.use}}
						</view>
						<view class="unused">
							未使用：{{item.all - item.use}}
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"

	export default {
		components: {
			uniPopup
		},
		onLoad() {
			//#ifdef H5
			requests.Prompt()
			//#endif
			let that = this
			this.shop = variable.shop
			this.account = variable.account

			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					that.client = res.data
				}
			})
		},
		onReady() {
			let Data = {
				type: "虚拟柜",
				shopNo: this.shop.fkshopNo,
			}
			if (this.client == "") {
				this.$refs.anRef.show("登录失效，请重新登录", {
					type: "error"
				});
				setTimeout(requests.toLogin, 1200)
			}
			let inc = JSON.stringify(Data)
			let url = "api/WeChatUser.ashx?Function=HttpGetVirtuals"
			requests.multiplexFun(this.client, inc, url).then(res => {
				if (res.data.State == "成功") {
					if (res.data.Body == "抱歉，您要找的内容不存在") {
						this.cabinetPoint = []
					} else {
						this.cabinetPoint = res.data.Body
					}
				}
			}), error => {
				console.log(error)
			}
		},
		data() {
			return {
				skip: "../cabinetPointDetail/cabinetPointDetail?item=",
				account: "",
				client: "",
				shop: {}, //登录的收衣店铺
				cabinetPoint: [] //所有收衣点
			}
		},
		methods: {
			revisePwd() {
				uni.navigateTo({
					url: "../revisePassword/revisePassword"
				})
			},
			counterInfo() {
				uni.navigateTo({
					url: "../cabinetPointDetail/cabinetPointDetail"
				})
			},
			secedeLogin() {
				this.$refs.popup.open()
			},
			cancelSec() {
				try {
					this.$refs.popup.close()
				} catch (e) {}
			},
			affirmSec() {
				uni.reLaunch({
					url: '../Login/Login'
				});
				try {
					this.$refs.popup.close()
				} catch (e) {}
			}
		}
	}
</script>
<style>
	/* #ifdef H5 */
	body {
		background-color: rgb(231, 228, 228);
	}

	/* #endif */
	page {
		font-size: 14px;
		background-color: rgb(231, 228, 228);
	}

	.my_info {
		background-color: #FFFFFF;
		border-bottom: 1px solid rgb(231, 228, 228);
		border-top: 1px solid rgb(231, 228, 228);
		border-left: 3px solid #0000FF;
		text-indent: 1.2em;
	}

	.user {
		border-bottom: 1px solid rgb(231, 228, 228);
	}

	.circle {
		font-size: 45upx;
		margin: 0 15upx;
	}

	.user,
	.pwd {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		position: relative;
	}

	.userpwd {
		background-color: #FFFFFF;
		border: 2px solid rgb(231, 228, 228);
		border-right: none;
	}

	.pwd button {
		position: absolute;
		right: 20upx;
	}

	.my_cabinet {
		background-color: #FFFFFF;
		border-left: 3px solid #0000FF;
		border-bottom: 2px solid rgb(231, 228, 228);
		text-indent: 1.2em;
	}

	.cabint_info {
		padding-top: 7upx;
	}

	.cabint_info_data {
		width: 48%;
		margin: 7upx 1%;
		border-radius: 7px;
		display: inline-block;
	}

	.name-no {
		background-color: #FFFFFF;
		text-indent: 17upx;
		line-height: 30upx;
	}

	.user_info {
		display: flex;
		flex-flow: row nowrap;
	}

	.use,
	.unused {
		width: 50%;
		text-align: center;
	}

	.use {
		background-color: #1AAD19;
		color: #FFFFFF;
	}

	.unused {
		background-color: rgb(201, 200, 200);
	}

	.prompt {
		text-align: center;
		margin-top: 30upx;
	}

	.secede {
		background-color: #FFFFFF;
		text-align: right;
	}

	.secede text {
		position: relative;
		right: 20upx;
		color: #0000FF;
	}

	.sec_login {
		width: 50%;
		height: 150rpx;
		background-color: #FFFFFF;
		border-radius: 10upx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		/* display: none; */
	}

	.sec_login .affirm {
		text-align: center;
		font-size: 35upx;
		font-weight: 600;
		line-height: 35px;
		margin-top: 7upx;
	}

	.option text {
		font-size: 35upx;
		display: inline-block;
		width: 50%;
		text-align: center;
		color: #666666;
	}

	.option text:first-child {}

	.option text:last-child {}

	/* 提示弹窗 */
	.uni-tip {
		padding: 15px;
		width: 250px;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		padding: 5px;
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		margin-top: 10px;
		display: flex;
	}

	.uni-tip-button {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
</style>
