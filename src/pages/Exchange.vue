<template>
    <div class="center" v-if="loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else class="centered-content">
        <md-card>
            <md-card-header>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100 ">
                        <md-list>
                            <md-list-item>
                                <md-avatar>
                                    <img :src="exchange.image">
                                </md-avatar>
                                <div class="md-list-item-text">
                                    <span class="md-headline"><b>{{exchange.name}}</b></span>                          
                                </div>
                            </md-list-item>
                        </md-list>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <md-list>
                            <md-list-item>
                                <div class="md-list-item-text">
                                </div>
                                 <span class="md-headline"><b>{{exchange.trade_volume_24h_btc | formatNumber }} btc</b></span>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>

            </md-card-header>
            <md-card-content>                  
                    <md-table v-model="this.tickers" md-sort="converted_volume.usd" md-sort-order="desc">
                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell md-label="Coin" md-sort-by="coin_id"><router-link :to="`/coin/${item.coin_id}/`">{{ item.coin_id }}</router-link></md-table-cell>
                            <md-table-cell md-label="coppia" md-sort-by="email">{{item.base}} / {{item.target}}</md-table-cell>
                            <md-table-cell md-label="Volume" md-sort-by="converted_volume.usd">{{item.converted_volume.usd | formatNumber }} $</md-table-cell>
                            <md-table-cell md-label="Last traded at" md-sort-by="last_traded_at">{{ item.last_traded_at }}</md-table-cell>
                        </md-table-row>
                        </md-table>
            </md-card-content>
        </md-card>

    </div>
</template>

<script>
import DataService from '../dataservice';
export default {
    data: function() {
        return {
            loading: true,
            exchange: [],
            tickers: []
        }
    },
    watch:{
        $route:function(){
            this.load()
            }
    },
    created: function() {
        this.load()
    },
    methods: {
        load:function(){
                this.loading = true;
                DataService.GetExchange(this.$route.params.name).then(data => {
                this.exchange = data.data
                this.tickers = data.data.tickers
                console.log(this.tickers)
                
                this.loading = false;
            })
        }
    }

}
</script>

<style lang="scss" scoped>

    .centered-f-container {
        width: 100%;     
    }
    .centered-content {
        max-width: 1200px;
        margin: 0 auto;
        margin-bottom: 24px;
        width: 100%
    }
    .center{
        text-align: center;
    }


</style>