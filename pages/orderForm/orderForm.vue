<template>
	<view>
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<uni-segmented-control :current="current" :values="items_title" @clickItem="onClickItem" style-type="text"
		 active-color="rgb(82, 82, 82)"></uni-segmented-control>
		<view class="content">
			<view class="datatiame">
				<view class="data start_data">
					<picker mode="date" :value="oldDate" :start="startOldDate" :end="endOldDate" @change="bindOldDateChange">
						<view>{{oldDate}}</view>
					</picker>
				</view>
				<view class="time start_time">
					<picker mode="time" :value="startTime" start="00:00" end="23:59" @change="bindOldTimeChange">
						<view>{{startTime}} </view>
					</picker>
				</view>
				<text class="to">至</text>
				<view class="data end_data">
					<picker mode="date" :value="newDate" :start="startNewDate" :end="endNewDate" @change="bindNewDateChange">
						<view>{{newDate}}</view>
					</picker>
				</view>
				<view class="time end_time">
					<picker mode="time" :value="endTime" start="00:00" end="23:59" @change="bindNewTimeChange">
						<view>{{endTime}} </view>
					</picker>
				</view>
				<image @tap="dataSetShow" src="../../static/imgs/u78.png"></image>
			</view>
			<view v-show="current == index" v-for="(item,index) in items" :key="index">
				<view class="bag_view" v-for="(bag,index) in sacks[index]" :key="index">
					<navigator :url="skip+encodeURIComponent(JSON.stringify(bag))+'&state='+encodeURIComponent(JSON.stringify(bag.state))">
						<view class="bag_img">
							<image src="../../static/imgs/u53.png" mode=""></image>
						</view>
						<view class="bag_type">
							<view class="bag-type">
								{{bag.nameBox}} : {{bag.boxIndex}}
							</view>
							<view>
								{{bag.fkOrderNo}}
							</view>
						</view>
						<view class="bag_data">
							<view class="data_type">
								{{item}}
							</view>
							<view class="data_time">
								{{bag.createDt}}
							</view>
						</view>
						<view class="icon_r">
							<text class="iconfont right">&#xe680;</text>
						</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'

	//时间日期
	function getDate(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (type == 'start') {
			year = year - 60;
		} else if (type == 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	};
	export default {
		onLoad() {
			//#ifdef H5
			requests.Prompt()
			//#endif
			variable.that = this
			//时间日期
			let dates = new Date
			let min = dates.getMinutes()
			let hour = dates.getHours()
			min = min > 9 ? min : "0" + min
			hour = hour > 9 ? hour : "0" + hour
			let Time = hour + ':' + min
			this.startTime = Time
			this.endTime = Time

			//登录状态
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					variable.that.client = res.data
				}
			})
		},
		onReady() {
			this.getAllOrder(this.parameter) //所有订单
		},
		data() {
			return {
				skip: "../orderFormDetails/orderFormDetails?item=",
				client: "", //登录状态
				current: 1,
				items_title: ['已存件', '处理中', '待取件', '已完成'],
				items: ['已存件', '处理中', '待取件', '已完成'],
				//时间选择器
				oldDate: getDate({
					format: true
				}),
				newDate: getDate({
					format: true
				}),
				startOldDate: getDate('start'),
				endOldDate: getDate('end'),
				startNewDate: getDate('start'),
				endNewDate: getDate('end'),
				startTime: '',
				endTime: '',
				// 袋子信息
				sacks: [
					[],
					[],
					[],
					[]
				], //所有收衣点订单信息，根据状态分成二维数组
				parameter: {
					judge: "收衣点订单",
					startDt: "",
					endDt: ""
				}
			}
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			//时间 选择器
			bindOldDateChange(e) { //日期
				this.oldDate = e.target.value
			},
			bindNewDateChange(e) {
				this.newDate = e.target.value
			},
			bindOldTimeChange(e) { //时间
				this.startTime = e.target.value
			},
			bindNewTimeChange(e) {
				this.endTime = e.target.value
			},

			//获取所有订单
			getAllOrder(par) {
				variable.that.sacks = [
					[],
					[],
					[],
					[]
				]
				let Data = par
				if (this.client == "") {
					this.$refs.anRef.show("登录失效，请重新登录", {
						type: "error"
					});
					setTimeout(requests.toLogin, 1200)
				}
				let inc = JSON.stringify(Data)
				let url = "api/Shop.ashx?Function=HttpGetReservationByShop"
				requests.multiplexFun(variable.that.client, inc, url).then(res => {
					if (res.data.State == "成功") {
						let n = res.data.Body.length
						for (let i = 0; i < n; i++) {
							for (let l = 0; l < 4; l++) {
								if (res.data.Body[i].state == l) {
									if(res.data.Body[i].fkOrderNo == null){
										res.data.Body[i].fkOrderNo = "暂无订单号"
									}
									variable.that.sacks[l].push(res.data.Body[i])
								}
							}
						}
					}
				}), error => {
					console.log(error)
				}
			},
			//指定时间订单
			dataSetShow() {
				this.sacks = [
					[],
					[],
					[],
					[]
				]
				let data = {
					judge: "收衣点订单",
					startDt: this.oldDate + " " + this.startTime,
					endDt: this.newDate + " " + this.endTime
				}
				this.$options.methods.getAllOrder(data)
			},
		}
	}
</script>

<style>
	page {
		font-size: 15px;
	}

	uni-segmented-control .segmented-control {
		width: 100%;
		height: 75upx;
	}

	.segmented-control-item {
		line-height: 75upx;
	}

	.datatiame {
		border-bottom: 3px solid #D8D8D8;
		border-top: 3px solid #D8D8D8;
		height: 65upx;
		line-height: 65upx;
	}

	.datatiame view {
		display: inline-block;
	}

	.datatiame image {
		position: absolute;
		right: 13upx;
		top: 82upx;
		width: 65upx;
		height: 65upx;
	}

	.data {
		margin-right: 10upx;
	}

	/* 订单详情 */
	.bag_view {
		border-bottom: 1px solid rgb(100, 100, 100);
	}

	.bag_img,
	.bag_type,
	.bag_data,
	.icon_r {
		display: inline-block;
	}

	.bag_type {
		width: 290upx;
	}

	.bag_img {
		padding: 15upx;
	}

	.bag_img image {
		width: 90upx;
		height: 90upx;
	}

	.bag-type,
	.data_type {
		font-weight: 600;
	}

	.bag-type,
	.data_type {
		position: relative;
		top: -16upx;
	}

	.bag_data {
		width: 38%;
		text-align: right;
	}

	.right {
		font-size: 20px;
		font-weight: 600;
		position: relative;
		top: -25upx;
		margin-left: 10upx;
	}

	.to {
		display: inline-block;
		margin: 0 15ups;
	}
</style>
