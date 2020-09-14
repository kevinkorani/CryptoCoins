import Vue from 'vue'
import App from './App.vue'

import DataService from "./dataservice";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Coin from "./pages/Coin";
import Exchange from "./pages/Exchange";
import Exchanges from "./pages/Exchanges";
import Portfolio from "./pages/Portfolio";

import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0.00");
});


let infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll)

Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter ({
  mode: "history",
  routes: [
    { name: "Login", path: "/login", component: Login },
    { name: "Home", path: "/", component: Home},
    { name: "Coin", path: "/coin/:name", component: Coin},
    { name: "Exchange", path: "/exchange/:name", component: Exchange},
    { name: "Exchanges", path: "/exchanges", component: Exchanges},
    { name: "Portfolio", path: "/portfolio", component: Portfolio}
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !DataService.isAuthenticated()) {
    next({ name: "Login" });
  } else {
    next();
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
