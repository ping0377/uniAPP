<template>
	<view>
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<uni-popup ref="popup" type="center" custom :mask-click="false">
			<view class="uni-tip">
				<view class="uni-tip-title">提示</view>
				<view class="uni-tip-content"><input type="number" v-model="pickUpCode" placeholder="输入取件码" /></view>
				<view class="uni-tip-group-button">
					<view class="uni-tip-button" @tap="cancelSec">取消</view>
					<view class="uni-tip-button" @tap="affirmSec">确定</view>
				</view>
			</view>
		</uni-popup>
		<view class="">
			<uni-segmented-control :current="current" :values="['预约信息','洗护信息']" @clickItem="onClickItem" style-type="text"
			 active-color="blue"></uni-segmented-control>
			<view v-if="current == 0" class="bespeak_info">
				<view class="orderform_data">
					<view class="icon_view">
						<text class="iconfont">&#xe64c;</text>
					</view>
					<view class="info_data">
						<view class="contacts_info">
							<text class="uni-bold">{{bespoke.userName}}：</text>
							<text class="uni-bold">{{bespoke.Tel}}</text>
						</view>
						<view class="contacts_city">
							<text>上门地址：<text>{{bespoke.Adress}}</text></text>
						</view>
					</view>
				</view>
				<view class="bespeak_info_data">
					<view class="status uni-bold left_border">
						<text>订单状态</text>
						<text>{{status}}</text>
					</view>
					<view class="">
						<text>订单号</text>
						<text>{{bespoke.pkNo}}</text>
					</view>
					<view class="">
						<text>下单时间</text>
						<text>{{bespoke.createDt}}</text>
					</view>
					<view class="">
						<text>预约上门时间</text>
						<text>{{bespoke.sDate}}</text>
					</view>
					<view class="">
						<text>备注</text>
						<text>{{bespoke.remark}}</text>
					</view>
					<view class="">
						<text>收取信息</text>
						<text>某某员工（{{bespoke.fkRecvWorkerNo}}）</text>
					</view>
					<view class="">
						<text>配送信息</text>
						<text>暂无配送信息</text>
					</view>
					<view class="">
						<text>离店时间：</text>
						<text>{{bespoke.DispatchDate}}</text>
					</view>
					<view class="uni-bold left_border">
						<text>洗护订单</text>
						<text>{{bespoke.fkOrderNo}}</text>
					</view>
					<view class="telephone uni-bold left_border">
						<text>{{bespoke.shopName}}</text>
						<text>{{bespoke.contectTel}}</text>
					</view>
					<view class="footer">
						<text class="shopadd">店铺地址：</text>
						<text>{{bespoke.shopAdd}}</text>
					</view>
				</view>
			</view>
			<view v-if="current == 1" class="protect_info">
				<view class="format uni-bold left_border">
					<text>物件数量：</text>
					<text>{{letter}}件</text>
				</view>
				<view class="" v-if="index <= clothingShow" v-for="(clothing,index) in thing" :key="index">
					<view class="protect_info_data">
						<view class="">
							<view class="cir"></view>
							<text>{{clothing.Name}}：{{clothing.AttachPrice}}</text>
						</view>
						<view class="">
							状态：<text>{{status}}</text>
						</view>
					</view>
					<view class="attach">
						<text>附加：{{clothing.AccessoryName}}({{clothing.AttachPrice}})</text>
						<text>|</text>
						<text>档次：{{clothing.ServiceName}}</text>
						<text>|</text>
						<text>附件：{{clothing.AttachName}}</text>
						<text>|</text>
						<text>颜色：{{clothing.ColorName}}</text>
						<text>|</text>
						<text class="str_red">瑕疵：{{clothing.flawName}}</text>
					</view>
				</view>
				<view class="show">
					<text @tap="attachShow" v-if="letter>2">{{show}}</text>
				</view>
				<view class="cost">
					<view class="left_border format money">
						<text>应收金额：</text>
						<text>{{orderDetails.yingshou}}</text>
					</view>
					<view>
						<view class="format"><text>洗护费：</text><text>{{orderDetails.WashPrice}}</text></view>
						<view class="format"><text>附加费：</text><text>{{orderDetails.AttachPrice}}</text></view>
						<view class="format"><text>总费用：</text><text>{{orderDetails.TotalPrice}}</text></view>
						<view class="format"><text>优惠券：</text><text>{{orderDetails.Coupon}}</text></view>
						<view class="format"><text>折扣额：</text><text>{{orderDetails.DiscountValue}}</text></view>
					</view>
					<view class="left_border format uni-bold">
						<text>订单编号：</text>
						<text>{{orderDetails.ReservePkNo}}</text>
					</view>
					<view>
						<view class="format"><text>收取时间：</text><text>{{orderDetails.OrderDate}}</text></view>
						<view class="format"><text>完成时间：</text><text>{{orderDetails.finishDt}}</text></view>
					</view>
					<view class="format uni-bold left_border">
						<text>{{orderDetails.shopName}}</text>
						<text>{{orderDetails.contectTel0}}</text>
					</view>
					<view class="format footer">
						<text class="shopadd">店铺地址：</text>
						<text>{{orderDetails.shopAdd}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="dispatching" v-if="current == 0">
			<button type="primary" @tap="Dispatching">配送</button>
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
		onLoad(option) {
			//#ifdef H5
			requests.Prompt()
			//#endif
			variable.that = this
			this.sack = JSON.parse(decodeURIComponent(option.item))
			console.log(this.sack)
			uni.getStorage({
				key: "ClientAddr",
				success: function(res) {
					variable.that.client = res.data
				}
			})
			uni.getStorage({
				key: "HTTP",
				success: function(res) {
					variable.HTTP = res.data
				}
			})
		},
		onReady() {
			this.getBespeak(this.sack) //获取预约信息
			this.getDispatching(this.sack) //配送信息
		},
		data() {
			return {
				allow: true,
				sack: {}, // 传递过来的数据
				current: 0,
				status: "", //订单状态
				bespoke: {}, //预约信息
				dispatching: {}, //配送信息
				orderDetails: {}, //订单详情
				thing: [], //物件详情
				clothingShow: 1,
				show: "点击展示所有物件",
				letter: "",
				client: "",
				pickUpCode: "" //取件码
			}
		},
		methods: {
			LoginStatus() {
				if (variable.that.client == "") {
					try {
						variable.that.$refs.anRef.show("登录失效，请重新登录", {
							type: "error"
						});
					} catch (e) {}
					setTimeout(requests.toLogin, 1200)
				}
			},
			onClickItem(index) {
				if (index == 1) {
					if (this.allow) { //请求一次再次切换就不再请求
						this.getOrderDetails(this.bespoke) //订单详情
						this.getThing(this.bespoke) //物件详情
						this.allow = false
					}
				}
				if (this.current !== index) {
					this.current = index;
				}
			},
			//展开收起
			attachShow() {
				if (this.show != "点击收起物件") {
					this.clothingShow = this.thing.length
					this.show = "点击收起物件"
				} else {
					this.clothingShow = 1
					this.show = "点击展开所有物件"
				}
			},
			//获取预约信息
			getBespeak(sack) {
				this.$options.methods.LoginStatus()
				let Data = {
					pkNo: sack.ReserveNo
				}
				let inc = JSON.stringify(Data)
				let url = "api/WeChatUser.ashx?Function=HttpQueryReservationInfo"
				let state = ""
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.State == "成功" && res.data.Body.length != 0) {
						this.bespoke = res.data.Body[0]
						state = this.bespoke.iState
						if (state == 0) {
							this.status = "未处理"
						} else if (state == 1) {
							this.status = "待收件"
						} else if (state == 2) {
							this.status = "洗涤中"
						} else if (state == 3) {
							this.status = "配送中"
						} else if (state == 4) {
							this.status = "已完成"
						} else {
							this.status = "已拒绝"
						}
					}
				}), error => {
					console.log(error)
				}
			},
			//配送信息
			getDispatching(sack) {
				this.$options.methods.LoginStatus()
				let Data = {
					ReserveNo: sack.ReserveNo //fkReserveNo
				}
				let inc = JSON.stringify(Data)
				let url = "api/WeChatUser.ashx?Function=HttpQueryDistributeInfo"
				requests.multiplexFun(this.client, inc, url).then(res => {
					this.dispatching = res.data.Body[0]
				}), error => {
					console.log(error)
				}
			},
			//订单详情
			getOrderDetails(sack) {
				this.$options.methods.LoginStatus()
				let Data = {
					no: sack.fkOrderNo //fkOrderNo
				}
				let inc = JSON.stringify(Data)
				let url = "api/WeChatUser.ashx?Function=HttpQueryWashOrderInfo"
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.Body.length == 0) {
						this.orderDetails = {
							yingshou: "",
							WashPrice: "",
							AttachPrice: "",
							TotalPrice: "",
							Coupon: "",
							DiscountValue: "",
							ReservePkNo: "",
							OrderDate: "",
							finishDt: "",
							shopName: "",
							contectTel0: "",
							shopAdd: ""
						}
					} else {
						this.orderDetails = res.data.Body[0]
					}
				}), error => {
					console.log(error)
				}
			},
			//物件详情
			getThing(sack) {
				this.$options.methods.LoginStatus()
				let Data = {
					orderNo: sack.fkOrderNo //fkOrderNo
				}
				let inc = JSON.stringify(Data)
				let url = "api/WeChatUser.ashx?Function=HttpQueryObjectInfo"
				requests.multiplexFun(this.client, inc, url).then(res => {
					this.thing = res.data.Body
					this.letter = this.thing.length
				}), error => {
					console.log(error)
				}
			},
			Dispatching() {
				this.$refs.popup.open()
			},
			cancelSec() {
				try {
					this.$refs.popup.close()
				} catch (e) {}
			},
			//确定配送
			affirmSec() {
				if (this.pickUpCode == "") {
					this.$refs.anRef.show("请输入取件码", {
						type: "warn"
					})
					return
				}
				let Data = {
					fkReserveNo: this.sack.ReserveNo,
					code: this.pickUpCode
				}
				let url = "api/Shop.ashx?Function=HttpExpressReservationDistribute"
				let inc = JSON.stringify(Data)
				requests.multiplexFun(variable.that.client, inc, url).then(res => {
					if (res.data.State == "成功") {
						this.$refs.anRef.show("成功配送", {
							type: "success"
						})
						variable.that.pickUpCode = "";
						variable.that.$refs.popup.close()
						setTimeout(function() {
							uni.navigateTo({
								url:"../dispatching/dispatching"
							});
						}, 1200)
					}
					if (res.data.State == "失败") {
						this.$refs.anRef.show("配送失败，该订单已配送", {
							type: "warn"
						})
						variable.that.pickUpCode = "";
						variable.that.$refs.popup.close()
						setTimeout(function() {
							uni.navigateTo({
								url:"../dispatching/dispatching"
							});
						}, 1200)
					}
				}), eror => {
					console.log(error)
				}
			}
		}
	}
</script>

<style>
	view {
		line-height: 1.5;
	}

	.orderform_data {
		border-bottom: 3px solid;
		border-image: url(../../static/imgs/u632.png) 30 30 round;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}

	.icon_view {
		align-items: center;
	}

	.info_data {
		padding-right: 30upx;
	}

	.icon_view .iconfont {
		font-size: 70upx;
		color: #0A98D5;
		margin: 0 10upx;
	}

	.contacts_info {
		width: 640upx;
		padding-top: 20upx;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}

	.contacts_city {
		width: 640upx;
	}

	uni-segmented-control .segmented-control {
		margin: 0;
	}

	.left_border {
		border-left: 3px solid #007AFF;
		height: 52upx;
		line-height: 52upx;
		margin: 10upx 0;
	}

	.bespeak_info .bespeak_info_data view {
		height: 65upx;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		padding-left: 20upx;
		padding-right: 20upx;
		line-height: 65upx;
	}

	.telephone {
		display: flex;
		justify-content: space-between;
	}

	.format {
		height: 65upx;
		display: flex;
		justify-content: space-between;
		padding-left: 20upx;
		padding-right: 35upx;
		line-height: 65upx;
	}

	.money {
		font-size: 1.2em;
		font-weight: bold;
	}

	.uni-bold {
		font-size: 30upx;
	}

	.protect_info_data {
		height: 65upx;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		padding-right: 15upx;
	}

	.cir {
		width: 20px;
		height: 20px;
		background-color: green;
		border-radius: 50%;
		display: inline-block;
		margin: 0 10upx;
		position: relative;
		top: 9upx;
	}

	.attach {
		background-color: #D8D8D8;
		padding: 3upx 35upx 0;
	}

	.attach text:nth-of-type(2n) {
		margin: 0 20upx;
	}

	.str_red {
		color: red;
	}

	.show {
		color: blue;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
	}

	.footer text {
		line-height: 40upx;
	}

	.shopadd {
		display: inline-block;
		width: 200upx;
	}

	.dispatching {
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	/* 弹出框 */
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
		padding: 18px 15px 9px;
		font-size: 14px;
		color: #666;
	}
	.uni-tip-content input{
		border:1px solid #BBBBBB;
		border-radius: 6px;
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
