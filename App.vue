<!-- <template>
</template> -->

<script>
	import variable from 'common/variable.js'
	// import amap from 'common/amap-wx.js';  
	export default {
		onLaunch: function() {
			// let Data = {
			// 	versionID: "1.0.0"
			// }
			// let inc = JSON.stringify(Data)
			//#ifdef APP-PLUS
			//检测版本更新
			uni.request({
				url: variable.HTTP + "api/Shop.ashx?Function=HttpGetVersion",
				method: "POST",
				data: {
					// Data:inc
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success(resp) {
					console.log(resp)
					if (plus.runtime.version != resp.data.Body) {
						uni.showModal({
							title: "更新提示",
							content: "发现新版本，是否更新",
							cancelText: "下次一定",
							confirmText: "确认更新",
							success: function(res) {
								if (res.confirm) {
									uni.showLoading({
										title: '更新中,请稍后',
										mask: true
									});
									let dload = plus.downloader.createDownload("http://tszy.fryxy.cn/VirtualCabinet+3333+.apk", {}, function(
										d, status) {
										if (status == 200) {
											uni.hideLoading();
											uni.showToast({
												title: '更新成功',
												duration: 3000
											});
										} else {
											console.log(status);
										}
									})
									dload.start()
								} else if (res.cancel) {
									console.log('暂不更新');
								}
							}
						})
					}
				}
			})
			//#endif
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style>
	@import url("./common/iconfont.css");
	@import url("./common/uni.css");

	page {
		font-size: 15px;
	}

	uni-page-head .uni-page-head {
		height: 44px;
	}

	/*每个页面公共css */
	/* .App_footer{
		height: 100upx;
		display: flex;
		flex-flow: row nowrap;
		position: absolute;
		bottom: 0;
	}
	.App_footer div{
		width: 250upx;
		height: 100upx;
	} */
</style>
