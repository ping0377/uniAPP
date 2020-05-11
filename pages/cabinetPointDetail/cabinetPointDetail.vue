<template>
	<view class="all">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="sacks_info" v-for="(item,index) in sacks" :key="index" @tap="orderFormData(item,item.state)">
			<view class=" sacks_img">
				<image src="../../static/imgs/u699.png"></image>
			</view>
			<view class="sacks_str">
				<text><text class="name">{{item.nameBox}}：</text>{{item.boxIndex}}</text>
				<text class="use_info" v-text="item.state == 0?'未使用':'使用中'"></text>
				<text class="iconfont data" v-if="item.state != 0 ">&#xe680;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import * as requests from '../../common/requests.js'
	export default {
		onLoad(option) {
			//#ifdef H5
			requests.Prompt()
			//#endif
			let that = this
			this.shop = JSON.parse(decodeURIComponent(option.item))
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					that.client = res.data
				}
			})
		},
		onReady() {
			let Data = {
				deviceID: this.shop.deviceID //"5LFMNWX4ttt"
			}
			if (this.client == "") {
				this.$refs.anRef.show("登录失效，请重新登录", {
					type: "error"
				});
				setTimeout(requests.toLogin, 1200)
			}
			let inc = JSON.stringify(Data)
			let url = "api/WeChatUser.ashx?Function=HttpGetVirtual"
			requests.multiplexFun(this.client, inc, url).then(res => {
				this.sacks = res.data.Body
			}), error => {
				console.log(error)
			}
		},
		data() {
			return {
				client: "",
				shop: {}, //收衣点传递过来的信息
				sacks: [],
				skip: "../orderFormDetails/orderFormDetails?item="
			}
		},
		methods: {
			orderFormData(item, state) {
				if (state == 0) {
					this.$refs.anRef.show("该收衣袋未使用！", {
						type: "warn"
					})
					return
				}
				uni.navigateTo({
					url: this.skip + encodeURIComponent(JSON.stringify(item)) + '&state=' + encodeURIComponent(JSON.stringify(item.state))
				})
			}
		}
	}
</script>

<style>
	.all {
		height: 100vh;
		background-color: rgb(231, 228, 228);
	}

	.sacks_info {
		background-color: #FFFFFF;
		border-top: 1px solid rgb(231, 228, 228);
		border-bottom: 1px solid rgb(231, 228, 228);
		display: flex;
		align-items: center;
		position: relative;
	}

	.sacks_img {
		padding: 12upx 12upx 0 12upx;
	}

	.sacks_img image {
		width: 60upx;
		height: 60upx;
	}

	.sacks_str text:first-child {
		margin-left: 0.7em;
	}

	.sacks_str text:nth-of-type(2) {
		position: absolute;
		right: 45upx;
	}

	.data {
		width: 16upx;
		position: absolute;
		right: 22upx;
		font-weight: 600;
	}
</style>
