<template>
	<view class="content">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="hint" v-show="Notavailable">
			<text>暂无可配送订单</text>
		</view>
		<view class="top">
			<input type="text" v-model="fkNo" placeholder="输入有效预约单号" />
			<button type="primary" @tap="getOrder">确定</button>
		</view>
		<view class="orders">
			<view class="info_view" v-for="(item,index) in orders" :key="index" @tap="toInfo(item)">
				<view class="order_item">
					<view>{{item.Addr}}</view>
					<view class="count_time">
						<text>件数：{{item.Count}}</text>
						<text class="time">下单号码：{{item.Tel}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'

	export default {
		onLoad() {
			//#ifdef H5
			requests.Prompt()
			//#endif
			variable.that = this
			this.shop = variable.shop
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					variable.that.client = res.data
				}
			})
		},
		onReady() {
			uni.request({
				url: "http://weilang.fryxy.cn/api/Shop.ashx?Function=HttpQueryTerminalDispatchTask",
				method: "POST",
				data: {
					ClientAddr: variable.that.client
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success(res) {
					if (res.data.State == "成功") {
						if (res.data.Body.length == 0) {
							variable.that.Notavailable = true;
						}
						variable.that.orders = res.data.Body;
						console.log(variable.that.orders)
					} else {
						variable.that.Notavailable = true;
						if (res.data.Reason == "你没有配送员权限") {
							variable.that.$refs.anRef.show("你没有配送员权限", {
								type: "warn"
							})
						}
					}
				}
			})
		},
		data() {
			return {
				fkNo: "",
				orders: [],
				Notavailable: false,
				skip: "../dispatchingInfo/dispatchingInfo?item="
			}
		},
		methods: {
			toInfo(item) {
				uni.navigateTo({
					url: this.skip + encodeURIComponent(JSON.stringify(item))
				})
			},
			getOrder() {
				this.$refs.anRef.show("别点了，没得用！", {
					type: "warn"
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

	.top input,
	.top button {
		display: inline-block;
	}

	.top input {
		width: -webkit-calc(70% - 12px);
		width: -moz-calc(70% - 12px);
		width: calc(70% - 12px);
		height: 35px;
		line-height: 35px;
		border: 1px solid;
		border-radius: 5px;
		text-indent: 1em;
		margin-right: 5px;
		padding-left: 5px;
	}

	.top button {
		width: 30%;
		height: 37px;
		line-height: 37px;
	}

	.hint {
		width: 100%;
		position: absolute;
		top: 45%;
		text-align: center;
		font-size: 42upx;
		color: #555555;
	}

	.order_item {
		background: #FFFFFF;
		margin: 0 7upx 16upx 7upx;
		padding: 0 25upx;
	}

	.order_item:hover {
		border: 1px solid #007AFF;
	}

	.count_time {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}
</style>
