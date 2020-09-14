<template>
    <div class="center" v-if="loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else class="centered-content">
        <md-card>
            <md-card-header>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                    <md-avatar>
                        <img :src="coin.image.large">
                    </md-avatar>
                    <span class="md-headline"><b>{{coin.name}}</b></span><br>
                    <span class="md-subheading">({{coin.symbol}})</span>
                </div>
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                    <md-list>
                        <md-list-item>
                            <div class="md-list-item-text">
                            </div>
                            <span class="md-headline"><b>$ {{coin.market_data.current_price.usd | formatNumber }}</b></span>
                        </md-list-item>
                    </md-list>
                </div>
            </div>
            </md-card-header>
            <md-divider></md-divider>
            <md-card-content>
                <div class="md-layout md-gutter  md-alignment-center">
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100 ">
                        <md-list>
                        <md-list-item>
                            <md-icon>leaderboard</md-icon><span class="md-list-item-text md-accent">Rank: {{coin.market_cap_rank}}</span>
                        </md-list-item>
                        </md-list>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <md-list>
                            <md-list-item>
                                <md-icon>language</md-icon><a class="md-list-item-text" v-bind:href="coin.links.homepage[0]">Website</a>
                            </md-list-item>
                        </md-list>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <md-list>
                            <md-list-item>
                                <md-icon>forum</md-icon><a class="md-list-item-text" v-bind:href="coin.links.official_forum_url[0]">Forum</a>
                            </md-list-item>
                        </md-list>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <md-list>
                            <md-list-item>
                                <md-icon>code</md-icon><a class="md-list-item-text" v-bind:href="coin.links.repos_url.github[0]">Github</a>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>
                <br>
                <md-divider></md-divider>

                <md-table>
                    <md-table-row>
                        <md-table-head>Market Cap</md-table-head>
                        <md-table-head>Total Volume</md-table-head>
                        <md-table-head>Circulating Supply</md-table-head>
                        <md-table-head>24h Low / 24h High</md-table-head>
                    </md-table-row>

                    <md-table-row>
                        <md-table-cell>$ {{coin.market_data.market_cap.usd | formatNumber}}</md-table-cell>
                        <md-table-cell>$ {{coin.market_data.total_volume.usd | formatNumber}}</md-table-cell>
                        <md-table-cell>{{coin.market_data.circulating_supply}} {{coin.symbol}}</md-table-cell>
                        <md-table-cell>$ {{coin.market_data.low_24h.usd | formatNumber}} / $ {{coin.market_data.high_24h.usd | formatNumber}}</md-table-cell>
                    </md-table-row>
                </md-table>
                <md-divider></md-divider>
                <br>
                <span class="md-headline"><b>About {{coin.name}}</b></span>
                <p v-html="coin.description.en"></p>
                <md-divider></md-divider>
                <br>
            <span class="md-headline"><b>Currency Converter</b></span>
            <br>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                    <md-field>
                        <md-input v-model="coinValue" type="number"></md-input>
                        <span class="md-suffix">{{coin.symbol}}</span>
                    </md-field>
                </div>
                
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                    <md-field>
                        <md-input v-model="currencyValue" type="number" ></md-input>
                        <span class="md-suffix">usd</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                    <md-button class="md-primary" :disabled="!coinValue && !currencyValue" @click="convert(coinValue, currencyValue)">Convert</md-button>
                </div>
                
            </div>

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
            coin: null,
            coinValue:null,
            currencyValue:null
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
                DataService.GetCoin(this.$route.params.name).then(data => {
                this.coin = data.data;
                console.log(data);
                this.loading = false;
            })
        },

        convert(coinValue, currencyValue){
            if(coinValue > 0)
            {
                    this.currencyValue = coinValue * this.coin.market_data.current_price.usd;
                    this.coinValue = null
            }
            else if (this.currencyValue > 0){
                console.log(currencyValue)
                this.coinValue = currencyValue /  this.coin.market_data.current_price.usd;
                this.currencyValue = ""
            }
            
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
    .md-field{
        max-width: 300px;
    }


</style>