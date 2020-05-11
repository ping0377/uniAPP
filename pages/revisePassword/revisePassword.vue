<template>
	<view class="content">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="input-group">
			<view class="input-row border">
				<text class="title" style="width: 17%;">账号：</text><text class="account" v-text="account"></text>
			</view>
			<view class="input-row">
				<text class="title">旧密码：</text>
				<m-input type="password" displayable v-model="oldpwd" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">新密码：</text>
				<m-input type="password" displayable v-model="newpwd" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<m-input type="password" displayable v-model="affirmPwd" placeholder="确认密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="revisePwd">提交修改</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input/m-input.vue'
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'

	export default {
		onLoad(){
			//#ifdef H5
			requests.Prompt()
			//#endif
			variable.that = this
			this.shop = variable.shop
			this.account = variable.account
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					variable.that.client = res.data
				},
				
			})
		},
		onReady() {
			this.LoginStatus()
		},
		components: {
			mInput
		},
		data() {
			return {
				account:"",			//账号
				oldpwd: "",			//旧密码
				newpwd: "",			//新密码
				affirmPwd: "",		//确认密码
				client: "",			//登录状态
				shop:{}
			}
		},
		methods: {
			LoginStatus() {
				if (variable.that.client == "") {
					variable.that.$refs.anRef.show("登录失效，请重新登录", {
						type: "error"
					});
					setTimeout(requests.toLogin, 1200)
				}
			},
			// 修改密码
			revisePwd() {
				this.$options.methods.LoginStatus()
				let Data = {
					Tel: this.account,
					pws: this.newpwd,
					oPsw: this.oldpwd,
				};
				let ToMy = function() {
					uni.switchTab({
						url: '../IndividualCenter/IndividualCenter'
					})
				}
				let ToLogin = function() {
					uni.reLaunch({
						url: '../Login/Login'
					})
				}
				if (this.newpwd == "" || this.oldpwd == "") {
					this.$refs.anRef.show("修改失败，信息未填完整", {
						type: "warn"
					})
					return
				} else if (this.oldpwd == this.newpwd) {
					this.$refs.anRef.show("修改失败，新密码和旧密码不能相同", {
						type: "warn"
					})
					return
				} else if (this.newpwd != this.affirmPwd) {
					this.$refs.anRef.show("修改失败，检查新密码和确认密码是否一致", {
						type: "warn"
					})
					return
				}
				let user = JSON.stringify(Data)
				let url = "api/Shop.ashx?Function=HttpChangePassword"
				requests.multiplexFun(this.client, user,url).then(res => {
					console.log(res)
					if (res.data.State == "成功") {
						this.$refs.anRef.show("修改成功", {
							type: "success"
						});
						setTimeout(ToMy, 1000)
					} else {
						this.$refs.anRef.show("修改失败，请输入正确的旧密码", {
							type: "error"
						});
					}
				}, error => {
					console.log(error)
				})

			}
		}
	}
</script>

<style>
	page {
		min-height: 100vh;
		display: flex;
	}
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
		padding: 20upx;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
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
	
	.account{
		height: 80upx;
		min-height: 80upx;
		line-height: 80upx;
	}
	
	/* #ifdef APP-PLUS || MP-WEIXIN */
	.input-row .title {
		width: 26%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}
	/* #endif */
	
	/* #ifdef H5 */
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
</style>
