<template>
  <div>

    <!--<div v-if="!userCoin.length">
      <md-empty-state 
        md-icon="devices_other"
        md-label="Create your first project"
        md-description="Creating project, you'll be able to upload your design and collaborate with people.">
      </md-empty-state>
    </div>-->
      <div>
        <md-button class="md-fab md-primary md-fab-bottom-right md-fixed" @click="showDialog = true"><md-icon>add</md-icon></md-button>
      </div>
      <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
        <md-dialog-title>Add your coin</md-dialog-title>
        <div class="md-dialog-content md-theme-default">
          <md-autocomplete
            class="SearchBox"
            md-layout="box"
            v-model="selectedCoin"
            :md-options="searchOptions"
            @md-changed="search"
            >
            <label>search by name...</label>
          </md-autocomplete>

          <md-field md-clear="true">
              <label>Quantity</label>
              <md-input v-model="quantity" type="number"></md-input>
          </md-field>
        </div>
        <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog = false">Close</md-button>
            <md-button class="md-primary" :disabled="!quantity || !selectedCoin || quantity <= 0" @click="addCoin(selectedCoin, quantity), showDialog= false">Save</md-button>
        </md-dialog-actions>
     </md-dialog>

    <div><!--v-if="userCoin.length"-->
      <md-dialog :md-active.sync="showDialogModify" :md-fullscreen="false">
        <md-dialog-title>Modify quantity</md-dialog-title>
        <div class="md-dialog-content md-theme-default">
          <md-field md-clear="true">
              <label>Quantity</label>
              <md-input v-model="quantityModified" type="number"></md-input>
          </md-field>
        </div>
        <md-dialog-actions>
            <md-button class="md-primary" @click="showDialogModify = false">Close</md-button>
            <md-button class="md-primary" @click="modifyCoin(); showDialogModify=false">Save</md-button>
            
        </md-dialog-actions>
     </md-dialog>

    <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
      <span>You already own this coin!</span>
      <md-button class="md-primary" @click="showDialog = true,showSnackbar = false">Retry</md-button>
    </md-snackbar>

      <div class="center">
        <br>
        <span class="md-body-2">BALANCE</span><br>
        <span class="md-display-3">{{this.balance | formatNumber }} $</span>
        <br>
      </div>
      <md-table v-model="userCoin">   
        <md-table-row slot="md-table-row" slot-scope="{ item }" >
          <md-table-cell md-label="Asset" md-sort-by="id"><img :src="item.image" width="25" height="25"> <router-link :to="`/coin/${item.id}/`">{{item.name}}</router-link></md-table-cell>
          <md-table-cell md-label="Amount" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>
          <md-table-cell md-label="Price" md-sort-by="current_price">{{ item.current_price | formatNumber }}</md-table-cell>
                  <md-table-cell md-label="Change (24h)" md-sort-by="price_change_percentage_24h"
          v-bind:class="{ positivo: item.price_change_percentage_24h > 0, negativo: item.price_change_percentage_24h < 0 }">{{ item.price_change_percentage_24h }} %</md-table-cell>
          <md-table-cell md-label="Price" md-sort-by="current_price">{{ item.current_price | formatNumber }}</md-table-cell>
          <md-table-cell><md-button class="md-raised md-primary" @click="showDialogModify = true; selectedDbId = item.dataId; selectedModifyCoin = item.coinId">modify</md-button><md-button class="md-raised md-accent" @click="deleteCoin(item.dataId)">delete</md-button></md-table-cell>
        </md-table-row>
      </md-table>
    </div>

  </div>
</template>

<script>
import DataService from '../dataservice';
import db from '../components/firebaseInit';

export default {
  data: function() {
    return {
      quantityModified: null,
      showDialogModify: false,
      showSnackbar: false,
      position: 'center',
      duration: 8000,
      isInfinity: false,
      showDialog: false,
      nameCoin: null,
      quantity: null,
      userCoin: [],
      coinInfo: [],
      selectedCoin: null,
      searchOptions: [],
      balance:null,
      coinValue: null,
      selectedModifyCoin: null,
      selectedDbId: null
    };
  },
  created () {
    this.showCoins();
  },
  watch: {
    showDialog: function(val) {
      if(val) {
        this.quantity = '';
        this.selectedCoin = ''
      }
    }
  },
  methods: {
      addCoin(nameCoin, quantity){
        const found = this.userCoin.some(el => el.coinId === nameCoin);
        if(!found){
          DataService.addCoin(nameCoin, quantity);
          this.showCoins();
        }
        else {
          this.showSnackbar = true
        }

      },
      showCoins(){
        this.userCoin = []
        this.balance = null
        db
        .collection("Coins")
        .where('username','==', localStorage.getItem("username"))
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              var data =
                {
                  'dataId': doc.id,
                  'coinId': doc.data().coinId,
                  'quantity': doc.data().quantity,
                  'username': doc.data().username
                }
                this.getInfo(data)                      
              }) 
          })
        },
      getInfo(dataCoin){
            DataService.PortfolioCoin(dataCoin.coinId).then(data => {
              this.coinValue = dataCoin.quantity * data.data[0].current_price;
              this.balance = this.balance + this.coinValue;
              console.log(this.balance)
              let tmp = {...data.data[0], ...dataCoin};
              this.userCoin.push(tmp);
            })            
      },
      search: function(term){
        term = term.toLowerCase();
        this.searchOptions = DataService.SearchCoin(term);
      },
      deleteCoin(id){
         DataService.deleteCoin(id, () => {
           this.showCoins();
         });
      },
      modifyCoin(){
        DataService.modifyCoin(this.selectedDbId, this.quantityModified, this.selectedModifyCoin);
        this.showCoins()
      }
  }
}
</script>

<style lang="scss" scoped>
  .md-dialog-content{
    padding: 0 24px 24px;
  }
  .md-field{
    max-width: 250px;
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