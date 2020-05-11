<template>
	<view class="content">
		<view class="iview">
			<view class="str">业务员姓名:</view>
			<input type="text" placeholder="请输入业务员姓名" v-model="uname" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">业务员电话:</view>
			<input type="number" placeholder="请输入业务员电话" v-model="workerTel" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">业务员身份证号:</view>
			<input type="number" placeholder="请输入身份证号" v-model="IDNo" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">店名:</view>
			<input type="text" placeholder="请输入店铺名字" v-model="shopName" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">店铺电话:</view>
			<input type="number" placeholder="请输入店铺电话" v-model="shopTel" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">店铺负责人:</view>
			<input type="text" placeholder="请输入负责人姓名" v-model="shopManager" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">营业执照编码:</view>
			<input type="text" placeholder="请输入营业执照编码" v-model="code" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<view class="iview">
			<view class="str">地址:</view>
			<input type="text" @focus="getaddr()" placeholder="请输入地址" v-model="address" placeholder-style="color:#ccc;fontSize:14px;">
		</view>
		<!-- <view class="iview">
			<view class="str">录入时间:</view>
			<input type="text" v-model="time" placeholder-style="color:#ccc;fontSize:14px;" disabled>
		</view> -->
		<view class="iview">
			<view class="str">营业执照照片</view>
			<view class="addclick" @tap="addclick()" v-show="showadd" placeholder-style="color:#ccc;fontSize:14px;">+</view>
			<view class="showimg">
				<img :src='BLimg' alt="">
			</view>
		</view>
		<button type="primary" @tap="submit()">立即提交</button>
	</view>
</template>

<script>
	// import graceChecker from '../../common/graceChecker.js'
	var graceChecker = require("../../common/graceChecker.js");
	import * as requests from '../../common/requests.js'
	import variable from '../../common/variable.js'
	export default {
		data() {
			return {
				showadd: true,
				uname: '',
				workerTel: '',
				time: '', // 录入时间
				address: '', // 地址
				longitude: '', //经度
				latitude: '', // 纬度
				BLimg: '', // 上传的营业执照照片
				code: '', //营业执照编码
				shopTel: '', //店铺电话
				shopName: '', //店铺名
				shopManager: '', //店铺负责人
				province: '', //省
				city: '', //市
				district: '', //区县
				http: '' ,//APP获取的url
				IDNo:''
			}
		},
		mounted() {

		},
		methods: {
			getaddr() {
				let that = this
				uni.chooseLocation({
					latitude: that.latitude,
					longitude: that.longitude,
					success: function(res) {
						// console.log(res.address, 'res')
						that.address = res.address;
						let long = res.longitude
						that.longitude = res.longitude
						that.latitude = res.latitude
						let lat = res.latitude
						let jw = (long, lat)
					},
				})
			},
			// 提交上传表单
			submit() {
				// console.log(this.http)
				if (this.uname == "" || this.tel == "" || this.code == "" || this.BLimg == "") {
					uni.showToast({
						title: '请确认信息填写完整!',
						position: 'top', //仅APP生效
						duration: 1000,
						icon: 'none',
					})
				} else {
					uni.showLoading({
						title: '提交中...',
						mask: true,
					})
					let Data = {
						workerName: this.uname,
						workerTel: this.workerTel,
						shopName: this.shopName,
						shopTel: this.shopTel,
						shopManager: this.shopManager,
						BLimg: this.BLimg,
						BLno: this.code,
						address: this.address,
						lat: this.latitude,
						lng: this.longitude,
						IDNo:this.IDNo
					}
					let inc = JSON.stringify(Data)
					// let url = this.http+'/api/Manager.ashx?Function=HttpAddMinShopGather'
					let url = "http://weilang.fryxy.cn/api/Manager.ashx?Function=HttpAddMinShopGather"
					// let url=window.location.origin+'/api/Manager.ashx?Function=HttpAddMinShopGather'
					uni.request({
						url: url,
						data: {
							Data: inc
						},
						method: 'post',
						header: {
							"Content-Type": "application/x-www-form-urlencoded" //自定义请求头信息
						},
						success: function(res) {
							console.log(res)
							if(res.data.State=="成功"){
								uni.showToast({
									title: '提交成功',
								})
								uni.hideLoading();
								uni.navigateTo({
									url:'../pagehome/pagehome'
								})
							}
						},
						fail:function(res){
							console.log(res)
						}
					})
				}
			},
			onShow() {
				// 地址信息
				uni.getStorage({
					key: 'HTTP',
					success: function(res) {
						// console.log(res.data);
						this.http = res.data;
					}
				}),
				uni.getLocation({
						type: 'wgs84',
						geocode: 'true',
						success: function(res) {
							this.longitude = res.longitude;
							this.latitude = res.latitude;
						}
					})
			},
			addclick() {
				// 上传图片
				// 获取对应商家的url
				let that = this
				// console.log(that.http)
				uni.getStorage({
					key:'HTTP',
					success:function(res){
						// console.log(res.data)
						that.http=res.data
					}
				})
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						// let url = window.location.origin+'/api/HttpImager.ashx?Function=HttpCreatePicture'
						// let url=that.http+'/api/HttpImager.ashx?Function=HttpCreatePicture'
						let url="http://weilang.fryxy.cn/api/HttpImager.ashx?Function=HttpCreatePicture"
						uni.uploadFile({
							url: url, //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'user': 'test',
							},
							success: (result) => {
								console.log(result, 'result')
								that.BLimg = JSON.parse(result.data).Body
								that.showadd = false;
							}
						});
					}
				})
			},
			onReady() {
				
				// 录入时间
				let now = new Date();
				var y = now.getFullYear();
				var m = now.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = now.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = now.getHours();
				h = h < 10 ? ('0' + h) : h;
				var minute = now.getMinutes();
				var second = now.getSeconds();
				this.time = y + '-' + m + '-' + d + ' ' + h + '-' + minute + '-' + second;
			}
		}
	}
</script>

<style>
	.showimg img {
		/* display: none; */
		width: 200upx;
		height: 200upx;
	}

	.content {
		padding-left: 10upx;
		padding-top: 30upx;
	}

	.addclick {
		width: 150upx;
		height: 150upx;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 150upx;
	}

	.addclick:hover {
		cursor: pointer;
	}

	.str {
		font-size: 32upx;
	}

	.iview {
		margin-bottom: 6upx;
	}
</style>
