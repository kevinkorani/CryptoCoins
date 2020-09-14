import axios from 'axios';
import db from './components/firebaseInit'
export default {

  isAuthenticated() {
    return localStorage.getItem("username");
  },
  login(username) {
    localStorage.setItem("username", username);
  },
  logout() {
    localStorage.removeItem("username");
  },
  GetCoins(page)
  {
    return axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=' + page);
  },
  GetCoin(name) {
    return axios.get('https://api.coingecko.com/api/v3/coins/'+name+'?localization=false&tickers=true&community_data=true');
  },
  /*GetChart() {
    return axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=14');
  },*/
  GetExchange(name){
    return axios.get('https://api.coingecko.com/api/v3/exchanges/' + name);
  },
  GetExchanges(page){
    return axios.get('https://api.coingecko.com/api/v3/exchanges?per_page=100?page=' + page);
  },
  PortfolioCoin(ids) {
    return axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+ids);
  },
  SearchCoin(text){
    if(!text) {
      return new Promise(resolve => {
        resolve([]);
      })
    }
      return axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd') /*https://api.coingecko.com/api/v3/coins/list --> ricerca oltre 60mila monete quindi un po' lenta a causa del server*/
      .then(data => {
      return data.data
      .filter((element) => element.id.indexOf(text) >= 0)
      .map(element => element.id);
      })
  },
  addCoin(name, value){
        return db
        .collection("Coins")
        .add({
          coinId: name,
          quantity: value,
          username: localStorage.getItem("username")
        })
    },
  deleteCoin(id, callback) {
      db.collection("Coins")
      .doc(id)
      .delete()
      .then(function() {
        callback();
      })
      .catch(function(e) {
      console.error(e);
      });
  },
  modifyCoin(dataId, value, quantity){
    db.collection("Coins")
    .doc(dataId)
    .set({
        coinId: quantity,
        quantity: value,
        username: localStorage.getItem("username")
    });
  }

    
};

