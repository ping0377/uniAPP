import Vue from 'vue'
import App from './App'
import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
import anLayer from '@/components/an-layer/an-layer.vue'

Vue.component('anLayer', anLayer)
Vue.component("uniSegmentedControl",uniSegmentedControl)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()