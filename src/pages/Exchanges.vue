<template>
  <div>
    <md-table v-model="exchanges" md-sort="trust_score_rank" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Exchanges</h1>
        </div>   
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Rank" md-sort-by="trust_score_rank">{{ item.trust_score_rank }}</md-table-cell>
        <md-table-cell md-label="Exchange" md-sort-by="name"><img :src="item.image" width="25" height="25"> <router-link :to="`/exchange/${item.id}/`">{{ item.name }}</router-link></md-table-cell>
        <md-table-cell md-label="Trust Score" md-sort-by="trust_score">{{ item.trust_score }}</md-table-cell>
        <md-table-cell md-label="Volume 24h normalized" md-sort-by="trade_volume_24h_btc_normalized">{{ item.trade_volume_24h_btc_normalized | formatNumber}} $</md-table-cell>
        <md-table-cell md-label="country" md-sort-by="country">{{ item.country }}</md-table-cell>

      </md-table-row>
    </md-table>
    
    <div class="center">
      <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
              infinite-scroll-distance="500">
    </div>
    
  </div>
</template>

<script>
import DataService from '../dataservice'
export default {
    data: function() {
    return {
            loading: true,
            exchanges: [],
            page: 0
        }
    },
    created() {
        this.loadMore()
    },
    methods: {
      loadMore() {
          this.loading = true;
          DataService.GetExchanges(this.page++).then(data => {
          this.exchanges = this.exchanges.concat(data.data);
          this.loading = false;
        })
      }
    }
    

}
</script>

<style scoped>
    .center{
        text-align: center;
    }
      .md-field {
    max-width: 300px;
  }
</style>