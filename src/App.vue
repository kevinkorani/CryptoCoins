<template>
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary md-layout">
            <div class="md-layout-item  md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible" v-if="auth">
                  <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">CryptoCoins</span>
            </div>

            <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <md-autocomplete v-if="auth"
                class="SearchBox"
                md-layout="box"
                v-model="selectedCoin"
                :md-options="searchOptions"
                @md-changed="search"
                @md-selected="select"
                >
                <label>search by name...</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" v-if="auth">
              <div class="md-toolbar-section-end" >
                <md-button @click="logout()">Logout</md-button>
              </div>
            </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-permanent="clipped" md-elevation="0">
          <md-avatar class="md-avatar-icon md-primary" style="margin: 8px 8px 8px 0px"></md-avatar>
          <b> {{username}}</b> 
        </md-toolbar>
        
        <md-list>
          <md-divider style="margin: -8px 0 8px 0"></md-divider>
          <router-link to="/" exact>
            <md-list-item @click="closeDrawer()">
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Home</span>
            </md-list-item>
          </router-link>

          <router-link to="/portfolio">
            <md-list-item @click="closeDrawer()">
              <md-icon>account_balance_wallet</md-icon>
              <span class="md-list-item-text">Portfolio</span>
            </md-list-item>
          </router-link>

          <router-link to="/exchanges">
            <md-list-item @click="closeDrawer()">
              <md-icon>account_balance</md-icon>
              <span class="md-list-item-text">Exchanges</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>

</template>

<script>
import DataService from './dataservice'

export default {
  name: 'App',
  data: function () {
    return {
      auth: DataService.isAuthenticated(),
      selectedCoin: null,
      searchOptions: [],
      menuVisible: false,
      username: localStorage.getItem("username")
    }
  },
  watch: {
    $route: function() {
      this.auth = DataService.isAuthenticated()
    }
  },
  components:{},
  methods: {
    search: function(term){
      term = term.toLowerCase();
      this.searchOptions = DataService.SearchCoin(term);
    },
    select: function(select){
      if(select === this.$route.params.id) return;
      this.$router.push({path: '/coin/'+ select});
    },
    closeDrawer() {
        this.$data.menuVisible = false;
    },
    logout: function() {
      DataService.logout();
      this.$router.push ({path:"/login"});
    }
  }

}
</script>

<style>
  .md-autocomplete-box-content {
    z-index: 1065 !important;
  }
</style>

<style scoped>

    .md-app {
        height: 100vh;
        overflow-y: hidden;
    }
    .md-drawer {
      width: 320px;
      max-width: calc(100vw - 125px);
    }
    .router-link {
      text-decoration: none;
    }
    .router-link-active {
    background-color: #6dd5ed80;
    }

</style>