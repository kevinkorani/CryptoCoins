<template>
  <div>
    <div>
    <md-table v-model="searched" md-sort="market_cap" md-sort-order="desc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Top 100 Cryptocurrencies by Market Capitalization</h1>
        </div>       

          <!--
         Ricerca nella table
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
        </md-field>


      <md-table-empty-state
        md-label="No coins found"
        :md-description="`No coin found for this '${search}' query. Try again`">
      </md-table-empty-state>-->
      </md-table-toolbar>

      

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Rank" md-sort-by="market_cap_rank">{{ item.market_cap_rank }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name"><img :src="item.image" width="25" height="25"> <router-link :to="`/coin/${item.id}/`">{{item.name}}</router-link></md-table-cell>
        <md-table-cell md-label="Market Cap" md-sort-by="market_cap">$ {{ item.market_cap | formatNumber }}</md-table-cell>
        <md-table-cell md-label="Price" md-sort-by="current_price">$ {{ item.current_price | formatNumber}} </md-table-cell>
        <md-table-cell md-label="Circulating Supply" md-sort-by="circulating_supply">{{ item.circulating_supply | formatNumber}} {{item.symbol}}</md-table-cell>
        <md-table-cell md-label="Change (24h)" md-sort-by="price_change_percentage_24h"
         v-bind:class="{ positivo: item.price_change_percentage_24h > 0, negativo: item.price_change_percentage_24h < 0 }">{{ item.price_change_percentage_24h }} %</md-table-cell>
      </md-table-row>
    </md-table>
    <div class="center">
      <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
              infinite-scroll-distance="500"></div>
    </div>

  </div>
      
</template>

<script>
import DataService from '../dataservice';

/*  const toLower = text => {
    return text.toString().toLowerCase();
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  }*/

  export default {
    data: () => ({
      page: 1,
      search: null,
      searched: [],
      coins: [],
      loading: false,
      currency: "usd"
    }),
    methods: {
      /*
      searchOnTable () {
        this.searched  = searchByName(this.coins, this.search)
      },*/
      loadMore() {
          this.loading = true;
          DataService.GetCoins(this.page++).then(data => {
          this.coins = this.coins.concat(data.data);
          this.searched = this.coins;
          this.loading = false;
          console.log(this.coins);
        }).catch(
          error => {
            console.log(error);
          }
        );
      }
    }
}
        
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
  .positivo {
    color: green;
    font-weight: bold;
  }
  .negativo {
    color: red;
    font-weight: bold;
  }
  .center{
        text-align: center;
    }
</style>