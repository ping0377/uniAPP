//#ifdef APP-PLUS
let editionWail = "1.0.0"
//#endif
let shop = {}
let account = ""
let that
//#ifdef APP-PLUS || MP-WEIXIN
let HTTP = "" //"../"  app  -- H5单位编号设定不显示
//#endif

//#ifdef H5
let HTTP = "../../../"
// let HTTP = "http://weilang.fryxy.cn/"
//#endif
let date = new Date
let year = date.getFullYear()
let month = date.getMonth() + 1
let day = date.getDay()
let Join = ["api/Applet.ashx?Function=HttpQueryOrderFormBy",
	"api/Applet.ashx?Function=HttpQueryClothesBy",
	"api/Applet.ashx?Function=HttpQueryOrderAmountBy"
]
let current = 0
let orderGain = 0

export default {
	shop,
	account,
	that,
	date,
	year,
	month,
	day,
	Join,
	current,
	orderGain,
	HTTP,
//#ifdef APP-PLUS
	editionWail
//#endif
}
