(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/employeeStock/employeeStock"],{"000b":function(t,e,o){"use strict";var n=o("16c0"),r=o.n(n);r.a},1176:function(t,e,o){"use strict";(function(t){o("6e31"),o("921b");n(o("66fd"));var e=n(o("9a6b"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("6e42")["createPage"])},"15f0":function(t,e,o){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c},r=[];o.d(e,"a",function(){return n}),o.d(e,"b",function(){return r})},"16c0":function(t,e,o){},4154:function(t,e,o){"use strict";(function(t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=s(o("a2ef")),a=i(o("012e"));function i(t){return t&&t.__esModule?t:{default:t}}function s(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(t,o):{};n.get||n.set?Object.defineProperty(e,o,n):e[o]=t[o]}return e.default=t,e}var f={onLoad:function(){a.default.that=this,t.getStorage({key:"ClientAddr",success:function(t){a.default.that.client=t.data}})},onReady:function(){},data:function(){return{client:"",orderNo:"",orderInfo:{},skip:"../orderFormDetails/orderFormDetails?item=",ordinfo:!0}},methods:{existFruit:function(){var t=this;if(""==this.client)this.$refs.anRef.show("登录失效，请重新登录",{type:"error"}),setTimeout(r.toLogin,1200);else if(""==this.orderNo)return void this.$refs.anRef.show("存件失败，请扫码或者输入预约单号",{type:"warn"});var e={fkReserveNo:this.orderNo},o="api/Applet.ashx?Function=HttpVirtualReservationDistribute",a=JSON.stringify(e);r.multiplexFun(this.client,a,o).then(function(e){console.log(n(e," at pages\\employeeStock\\employeeStock.vue:100")),"成功"==e.data.State?(t.$refs.anRef.show("存件成功",{type:"success"}),t.orderInfo=e.data.Body,t.orderInfo.state=2):"失败"==e.data.State&&-1!=e.data.Reason.indexOf("预约单已配送")?(t.$refs.anRef.show("存件失败，预约单已配送",{type:"warn"}),t.orderInfo.state=3):"失败"==e.data.State&&"缺少员工号"==e.data.Reason?t.$refs.anRef.show("存件失败，缺少员工号",{type:"warn"}):t.$refs.anRef.show("存件失败，检查订单号是否正确",{type:"warn"})})},getSackInfo:function(){console.log(n(this.orderInfo," at pages\\employeeStock\\employeeStock.vue:127")),""!=this.orderNo?this.ordinfo?this.$refs.anRef.show("订单号有误，请检查订单号",{type:"warn"}):t.navigateTo({url:this.skip+encodeURIComponent(JSON.stringify(this.orderInfo))+"&state="+encodeURIComponent(JSON.stringify(this.orderInfo.state))}):this.$refs.anRef.show("请先输入单号或扫码",{type:"warn"})},sweepCode:function(){t.scanCode({success:function(t){if(a.default.that.orderNo=t.result,""!=a.default.that.orderNo){a.default.that.orderInfo.pkNo=a.default.that.orderNo,a.default.that.orderInfo.state=1;var e={pkNo:a.default.that.orderNo},o=JSON.stringify(e),i="api/WeChatUser.ashx?Function=HttpQueryReservationInfo";r.multiplexFun(a.default.that.client,o,i).then(function(t){console.log(n(t.data," at pages\\employeeStock\\employeeStock.vue:159")),0==t.data.Body.length?a.default.that.ordinfo=!0:a.default.that.ordinfo=!1})}setTimeout(function(){a.default.that.existFruit()},0)}})},getInfo:function(){var t=this;if(""!=this.orderNo){this.orderInfo.pkNo=this.orderNo,this.orderInfo.state=1;var e={pkNo:this.orderNo},o=JSON.stringify(e),a="api/WeChatUser.ashx?Function=HttpQueryReservationInfo";r.multiplexFun(this.client,o,a).then(function(e){console.log(n(e.data," at pages\\employeeStock\\employeeStock.vue:220")),0==e.data.Body.length?t.ordinfo=!0:t.ordinfo=!1})}}}};e.default=f}).call(this,o("6e42")["default"],o("0de9")["default"])},"7dc3":function(t,e,o){"use strict";o.r(e);var n=o("4154"),r=o.n(n);for(var a in n)"default"!==a&&function(t){o.d(e,t,function(){return n[t]})}(a);e["default"]=r.a},"9a6b":function(t,e,o){"use strict";o.r(e);var n=o("15f0"),r=o("7dc3");for(var a in r)"default"!==a&&function(t){o.d(e,t,function(){return r[t]})}(a);o("000b");var i=o("2877"),s=Object(i["a"])(r["default"],n["a"],n["b"],!1,null,null,null);e["default"]=s.exports}},[["1176","common/runtime","common/vendor"]]]);