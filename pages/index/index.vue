<template>
	<view>
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="top_nav">
			<div @tap="staffPickUp">
				<image src="../../static/imgs/u347.png" mode=""></image>
				<text class="nav_text">员工取件</text>
			</div>
			<div @tap="staffSave">
				<image src="../../static/imgs/u327.png" mode=""></image>
				<text class="nav_text">员工存件</text>
			</div>
			<div @tap="shopperPickUp">
				<image src="../../static/imgs/u332.png" mode=""></image>
				<text class="nav_text">顾客取件</text>
			</div>
			<div class="movr"><text class="nav_text_movr" @tap="stillMore">更多</text></div>
		</view>
		<view class="main">
			<uni-segmented-control :current="current" :values="items_title" @clickItem="onClickItem" style-type="text"
			 active-color="blue"></uni-segmented-control>
			<view class="content">
				<view v-show="current == index" v-for="(item,index) in items" :key="index">
					<view class="datas">
						<uni-segmented-control :current="dateCurrent" :values="dates" @clickItem="getAllOrderCount" style-type="button"
						 active-color="blue"></uni-segmented-control>
					</view>
					<view class="statistics_content">
						<view class="content_title">{{item.title}}</view>
						<view class="statistics_main">
							<view class="statistics_all statistics_item">
								<view class="statistics_item_num">{{countQuantity[0][0]}}</view>
								<view class="statistics_item_text">{{item.order_name[0]}}</view>
							</view>
							<view class="statistics_suc statistics_item">
								<view class="statistics_item_num">{{countQuantity[1][0]}}</view>
								<view class="statistics_item_text">{{item.order_name[1]}}</view>
							</view>
							<view class="statistics_un statistics_item">
								<view class="statistics_item_num">{{countQuantity[2][0]}}</view>
								<view class="statistics_item_text">{{item.order_name[2]}}</view>
							</view>
							<view class="statistics_cel statistics_item">
								<view class="statistics_item_num">{{countQuantity[3][0]}}</view>
								<view class="statistics_item_text">{{item.order_name[3]}}</view>
							</view>
						</view>
					</view>
					<view v-if="index == 2" class="statistics_content">
						<view class="content_title">已完成订单提成</view>
						<view class="statistics_main">
							<view class="statistics_all statistics_item">
								<view class="statistics_item_num">{{orderGain}}</view>
								<view class="statistics_item_text">订单提成</view>
							</view>
						</view>
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
			// #ifdef H5
			if (uni.getSystemInfoSync().platform == "ios") {
				let url = location.href.split("#")[0]
				let inc = {
					PageUrl: url
				}
				let i = JSON.stringify(inc)
				requests.getConfig(variable.that.client,i)
			}
			// #endif
			this.getAllOrderCount(variable.current)
			requests.getStartDate(this.scope).then(data => {
				variable.that.startdate = data
			})
			this.orderGain = variable.orderGain
		},
		onShow() {
			variable.that = this
		},
		data() {
			return {
				startdate: "",
				scope: "day",
				shop: {}, //当前登录的店铺
				dateCurrent: 0, //所选择的统计时间
				current: 0, //所选择的统计类
				dates: ["今日", "一周内", "一月内", "一年内"],
				dateScope_op: ["day", "week", "month", "year"],
				items_title: ['订单统计', '物件统计', '金额统计'],
				items: [{
					"title": '订单统计',
					"order_name": ["总订单", "完成订单", "未完成订单", "已取消订单"]
				}, {
					"title": '物件统计',
					"order_name": ["衣物总件数", "完成件数", "未完成件数", "已取消件数"]
				}, {
					"title": '金额统计',
					"order_name": ["订单总额", "完成单金额", "未完成单金额", "取消单金额"]
				}],
				footerNav: [{
						"title": "工作台",
						"src": "../../static/footer/u108.png"
					},
					{
						"title": "订单",
						"src": "../../static/footer/u103.png"
					},
					{
						"title": "我的",
						"src": "../../static/footer/u113.png"
					}
				],
				client: "",
				countQuantity: [
					[],
					[],
					[],
					[]
				], //订单数量
				orderGain: 0 //已完成订单提成
			}
		},
		methods: {
			onClickItem(index) {
				if (index == 2) {
					this.getFinishOrder("day")
				}
				if (this.current !== index) {
					this.current = index;
					variable.current = index
				}
				this.getAllOrderCount(0)
			},
			staffPickUp() {
				uni.navigateTo({
					url: "../employeePick-up/employeePick-up"
				})
			},
			staffSave() {
				uni.navigateTo({
					url: "../employeeStock/employeeStock"
				})
			},
			shopperPickUp() {
				uni.navigateTo({
					url: "../customerPick-up/customerPick-up"
				})
			},
			stillMore() {
				this.$refs.anRef.show("敬请期待", {
					type: "warn"
				});
			},

			//指定时间订单统计
			getOrderCount(urlType, dateScope, index) {
				let date = new Date
				let startdate
				requests.getStartDate(dateScope).then(data => {
					startdate = data
				})
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let nowdata = year + "-" + month + "-" + day //当前日期
				let nowtime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
				setTimeout(function() {
					let DateTime = {
						startDt: startdate + " " + "00:00:00",
						endDt: nowdata + " " + nowtime
					}
					if (variable.that.client == "") {
						variable.that.$refs.anRef.show("登录失效，请重新登录", {
							type: "error"
						});
						setTimeout(requests.toLogin, 1500)
					}
					let inc = JSON.stringify(DateTime)
					let url = variable.Join[variable.current] + urlType
					requests.multiplexFun(variable.that.client, inc, url).then(res => {
						if (res.data.State == "成功") {
							if (res.data.Body == null) {
								res.data.Body = 0
							}
							let sum = (Number(res.data.Body * 1000)) / 1000
							variable.that.countQuantity[index].push(sum)
						}
					}), error => {
						console.log(error)
					}
				}, 0)
			},
			//所有统计
			getAllOrderCount(index) {
				if (this.dateCurrent !== index) {
					this.dateCurrent = index;
				}
				variable.that.countQuantity = [
					[],
					[],
					[],
					[]
				]
				this.$options.methods.getOrderCount("Total", this.dateScope_op[index], 0)
				this.$options.methods.getOrderCount("Finish", this.dateScope_op[index], 1)
				this.$options.methods.getOrderCount("Unfinished", this.dateScope_op[index], 2)
				this.$options.methods.getOrderCount("Cancel", this.dateScope_op[index], 3)
				if (this.current == 2) {
					this.$options.methods.getFinishOrder(this.dateScope_op[index])
				}
			},
			//已完成订单提成
			getFinishOrder(dateScope) {
				if (variable.that.client == "") {
					variable.that.$refs.anRef.show("登录失效，请重新登录", {
						type: "error"
					});
					setTimeout(requests.toLogin, 1500)
				}
				let date = new Date
				let startdate
				requests.getStartDate(dateScope).then(data => {
					startdate = data
				})
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let nowdata = year + "-" + month + "-" + day //当前日期
				let nowtime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

				setTimeout(function() {
					let Datatime = {
						startDt: startdate + " " + "00:00:00",
						endDt: nowdata + " " + nowtime
					}
					let inc = JSON.stringify(Datatime)
					let url = "api/Applet.ashx?Function=HttpQueryOrderAmountByFinishAndCommission"
					requests.multiplexFun(variable.that.client, inc, url).then(res => {
						if (res.data.State == "成功") {
							let sum = (Number(res.data.Body * 1000)) / 1000
							variable.that.orderGain = sum
						}
					}), error => {
						console.log(error)
					}
				}, 0)
			}
		}
	}
</script>

<style>
	page {
		background-color: #D8D8D8;
	}

	.top_nav {
		display: flex;
		flex-flow: row nowrap;
	}

	.top_nav div {
		width: 187.5upx;
		border: 1px solid rgb(231, 231, 230);
		border-bottom: 8px solid rgb(231, 231, 230);
		text-align: center;
		background-color: #FFFFFF;
	}

	.top_nav div image {
		width: 100upx;
		height: 100upx;
		display: block;
		margin: 12upx auto;
	}

	.nav_text,
	.nav_text_movr {
		font-size: 14px;
		font-weight: 600;
		color: rgb(97, 97, 97);
	}

	.movr {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main {
		background-color: #FFFFFF;
	}

	.segmented-control {
		display: flex;
		flex-flow: row nowrap;
	}

	uni-segmented-control .segmented-control {
		margin: 0;
	}

	.content {
		border-top: 3px solid rgb(231, 231, 230);
	}

	.datas uni-segmented-control .segmented-control {
		height: 50upx;
		width: 97%;
	}

	.datas .segmented-control {
		margin: 10upx auto;
	}

	.datas .segmented-control-item {
		line-height: 50upx;
	}

	.statistics_content {
		width: 100%;
		padding: 3px;
		background-color: rgb(219, 217, 217);
	}

	.content_title {
		border-left: 3px solid blue;
		font-weight: bold;
		background-color: white;
		text-indent: 1em;
	}

	.statistics_main {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		padding: 1px 3px 0;
	}

	.statistics_item {
		width: 33%;
		height: 245upx;
		background-color: #FFFFFF;
	}

	.statistics_item:last-child {
		margin-top: 2px;
	}

	.statistics_item_num,
	.statistics_item_text {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.statistics_item_num {
		width: 100%;
		height: 55%;
	}

	.statistics_item_text {
		width: 100%;
		height: 45%;
	}

	/* .statistics {
		display: flex;
		flex-flow: row nowrap;
		height: 58upx;
		font-size: 14px;
		border-bottom: 3px solid rgb(231, 231, 230);
	}

	.statistics li {
		width: 170upx;
		line-height: 58upx;
		text-align: center;
	}

	.li_select {
		font-size: 15px;
		font-weight: bold;
		border-bottom: 3px solid blue;
	} */
	/* .footerNav{
		width: 100%;
		height: 150upx;
		display: flex;
		flex-flow: row nowrap;
	}
	.nav_box{
		display: flex;
		flex-direction: column;
		text-align: center;
		width: 25%;
	}
	.nav_box:nth-of-type(2){
		width: 50%;
	}
	.nav_img{
		width: 70upx;
		height: 70upx;
	} */
</style>
