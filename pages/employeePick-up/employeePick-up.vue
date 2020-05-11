<template>
	<view class="alldata">
		<an-layer ref="anRef" autoClose timer="2">
		</an-layer>
		<view class="sweep_code">
			<view class="sweep_code_data">
				<input placeholder="请输入袋子编号,或扫码" v-model="sackIndex" />
				<button @tap="existFruit">确定</button>
				<!-- #ifdef APP-PLUS || MP-WEIXIN -->
				<text class="iconfont uni-bold" @tap="sweepCode">&#xe624;</text>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<text class="iconfont uni-bold" @tap="sweepCodeh5">&#xe624;</text>
				<!-- #endif -->
			</view>
		</view>
		<view class="orders">
			<view class="info_view" v-for="(item,index) in inUseOrder" :key="index">
				<view class="checkbox">
					<checkbox value="c" :checked="item.checked" @tap="changeCheck(item)" />
				</view>
				<view class="sackinfo">
					<view class="uni-bold">
						<text>{{item.nameBox}}:</text><text>{{item.boxIndex}}</text>
					</view>
					<view class="">
						<text>预约单号:</text>
					</view>
					<view class="">
						<text>{{item.pkNo}}</text>
					</view>
				</view>
				<view class="distime">
					<view class="uni-bold">
						处理中
					</view>
					<view class="">
						{{item.createDt}}
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="option">
				<button class="checkall" type="default" @tap="checkAll">全选</button>
				<!-- <picker class="select" mode="selector" :range="opStaff" :value="orIndex" @change="selectEmployee"> -->
				<picker class="select" mode="selector" :range="opStaff" @change="selectEmployee">
					<view><text>{{name}}</text> <text>{{No}}</text> <text class="iconfont">&#xeb6d;</text></view>
				</picker>
			</view>
			<button class="confirm uni-bold" @tap="totalSum">确定取件（已选<text v-text="pickUpSum"></text>单）</button>
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
			this.shop = variable.shop
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
			this.getAllStaff(this.shop)
			this.checki = 0
		},
		data() {
			return {
				client: "",
				shop: {},
				sackIndex: "", //袋子编号
				existType: "", //存件结果
				type: "", //弹窗类型
				inUseOrder: [], //全部订单
				orIndex: "0",
				opStaff: [], //全部员工信息
				name: "员工名称",
				No: "员工编号",
				pickUpSum: 0, //取件数量
				staffs: [], //全部员工
				check: "",
				checki: "" //该标识为判定是否第一次点击全选
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
			//输入袋子编号点击确定查询订单
			existFruit() {
				this.$options.methods.LoginStatus()
				if (this.sackIndex == "") {
					this.$refs.anRef.show("输入袋子编号或扫码", {
						type: "warn"
					});
					return
				}
				this.inUseOrder = []
				let Data = {
					boxIndex: this.sackIndex
				}
				let inc = JSON.stringify(Data)
				let url = "api/Applet.ashx?Function=HttpGetDeviceIDOrderByVirtual"
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.State == "成功") {
						let pickOrders = new Array
						pickOrders = res.data.Body
						if (pickOrders.length == 0) {
							this.$refs.anRef.show("该收衣袋没有待取件订单，或者收衣袋编号有误", {
								type: "warn"
							});
						} else {
							for (let i = 0; i < pickOrders.length; i++) {
								if (pickOrders[i].state == 0) {
									this.inUseOrder.push(pickOrders[i])
								}
							}
							if (this.inUseOrder.length == 0) {
								this.$refs.anRef.show("该收衣袋没有待取件订单，或者收衣袋编号有误", {
									type: "warn"
								});
							}
						}
					}
				}), error => {
					console.log(error)
				}
			},
			//全选
			checkAll() {
				if (this.inUseOrder.length == 0) {
					this.$refs.anRef.show("未查询到订单", {
						type: "warn"
					});
					return
				}

				this.checki == 0 ? this.check = false : this.check = true
				for (let i = 0; i < this.inUseOrder.length; i++) {
					if (this.inUseOrder[i].checked == false) {
						this.check = false
						break
					}
				}
				for (let i = 0; i < this.inUseOrder.length; i++) {
					this.inUseOrder[i].checked = !this.check
					if (this.inUseOrder[i].checked) {
						this.pickUpSum = this.inUseOrder.length
					} else {
						this.pickUpSum = 0
					}
				}
				this.checki = 1
			},

			selectEmployee(e) {
				this.orIndex = e.target.value
				this.name = this.staffs[this.orIndex].Name
				this.No = this.staffs[this.orIndex].pkNo
			},
			//扫码
			//#ifdef APP-PLUS || MP-WEIXIN
			sweepCode() {
				uni.scanCode({
					success: function(res) {
						variable.that.sackIndex = res.resultStr.split("?boxIndex=")[1] //扫码返回的数据进行截取获取收衣袋编号
						variable.that.existFruit()
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
						console.log("成功")
						variable.that.sackIndex = res.resultStr.split("?boxIndex=")[1]; // 当needResult 为 1 时，扫码返回的结果
						variable.that.existFruit()
					}
				})
			},
			//#endif
			//确定取件
			totalSum() {
				let orderArr = new Array
				let indexArr = new Array
				for (let i = 0; i < this.inUseOrder.length; i++) {
					if (this.inUseOrder[i].checked == true) {
						orderArr.push(this.inUseOrder[i].pkNo)
						indexArr.push(this.inUseOrder[i].boxIndex)
					}
				}
				if (orderArr.length < 1) {
					this.$refs.anRef.show("取件失败，你未选择收取衣物", {
						type: "warn"
					});
					return
				}
				if (this.No == "员工编号") {
					this.$refs.anRef.show("取件失败，请选择收件员工", {
						type: "warn"
					});
					return
				}
				let Data = {
					fkWorkerNo: this.No,
					Reserve: orderArr,
					boxIndex: indexArr
				}
				this.$options.methods.LoginStatus()
				let inc = JSON.stringify(Data)
				let url = "api/Applet.ashx?Function=HttpVirtualReservationReceive"
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.State == "失败" && res.data.Reason == "你没有收衣的权限") {
						this.$refs.anRef.show("取件失败，该员工没有收衣权限", {
							type: "warn"
						})
					} else if (res.data.State == "失败" && res.data.Reason == "员工确认有误") {
						this.$refs.anRef.show("取件失败，员工确认有误", {
							type: "warn"
						})
					} else if (res.data.State == "成功") {
						this.$refs.anRef.show("取件成功", {
							type: "success"
						})
						setTimeout(this.existFruit, 500)
					}
				}), error => {
					console.log(error)
				}
			},
			//点击checkbox
			changeCheck(item) {
				let sum = 0
				item.checked = !item.checked
				this.pickUpSum
				for (let i = 0; i < this.inUseOrder.length; i++) {
					if (this.inUseOrder[i].checked == true) {
						sum += 1
					}
				}
				this.pickUpSum = sum
			},
			//全部员工
			getAllStaff(shop) {
				let info
				let Data = {
					// ShopNo: shop.fkshopNo
				}
				this.$options.methods.LoginStatus()
				let inc = JSON.stringify(Data)
				let url = "api/Manager.ashx?Function=HttpQueryAllNormalWorkers"
				requests.multiplexFun(this.client, inc, url).then(res => {
					if (res.data.State == "成功") {
						this.staffs = res.data.Body
						for (let i = 0; i < this.staffs.length; i++) {
							info = this.staffs[i].Name + "： " + this.staffs[i].pkNo
							this.opStaff.push(info)
						}
					}
				}), error => {
					console.log(error)
				}
			}
		}
	}
</script>

<style>
	page {
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
		left: 415upx;
		top: -3upx;
	}

	.sweep_code .sweep_code_data input {
		width: 430upx;
		height: 80upx;
		line-height: 80upx;
		min-height: 80upx;
		border: 1px solid;
		background-color: #FFFFFF;
		display: inline-block;
		border-radius: 160upx 160upx 160upx 160upx;
		padding-left: 60upx;
		margin-right: 15upx;
	}

	.sweep_code_data .iconfont {
		z-index: 3;
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

	.info_view {
		border-bottom: 2px solid #D8D8D8;
		background-color: #FFFFFF;
		display: flex;
		flex-flow: row nowrap;
	}

	.checkbox {
		width: 120upx;
		height: 120upx;
		position: relative;
	}

	.checkbox checkbox {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: scale(0.9) translate(-50%, -50%);
	}

	.sackinfo {
		width: 54%;
	}

	.distime {
		width: 35%;
		text-align: center;
	}

	.option {
		display: flex;
		flex-flow: rwo nowrap;
	}

	.checkall {
		width: 40%;
		height: 71upx;
		background-color: #FFFFFF;
		font-size: 32upx;
		line-height: 75upx;
		margin-right: 30upx;
	}

	/* #ifdef  H5 */
	.select {
		width: 58%;
		height: 35px;
		background-color: #FFFFFF;
		border: 1px solid #D8D8D8;
		padding: 10upx;
		border-radius: 10upx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN || APP-PLUS*/
	.select {
		width: 58%;
		height: 50upx;
		background-color: #FFFFFF;
		border: 1px solid #D8D8D8;
		padding: 10upx;
		border-radius: 10upx;
	}

	/* #endif */
	.select view {
		border: 1px solid #D8D8D8;
		border-radius: 7upx;
	}

	.select view text {
		display: inline-block;
	}

	.select view text:first-child {
		width: 45%;
		text-indent: 3px;
	}

	.select view text:nth-of-type(2) {
		width: 46%;
		text-indent: 1em
	}

	.select .iconfont {
		font-size: 22upx;
	}

	.confirm {
		background-color: #0A98D5;
		color: #FFFFFF;
	}

	.orders {}

	.footer {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
</style>
