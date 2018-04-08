<template>
  <v-app light>

    <v-navigation-drawer fixed clipped v-model="sidebar" app>
      <menu-wrapper @sync="sync" v-bind:synchronized="synchronized"></menu-wrapper>
    </v-navigation-drawer>

    <v-toolbar app clipped-left fixed prominent>
      <v-toolbar-side-icon @click.stop="sidebar = !sidebar" light></v-toolbar-side-icon>
      <v-toolbar-title v-text="!stocks || stocks.length === 0 ? manifest.name : $route.name" class="hidden-sm-and-down"></v-toolbar-title>
      <v-spacer class="hidden-sm-and-down"></v-spacer>

      <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search" />

      <v-btn outline color="orange" class="ml-3 hidden-sm-and-down" @click="favourites()">
        <v-icon left v-if="starred">star</v-icon>
        <v-icon left v-if="!starred">star_border</v-icon>
        Favoritos
      </v-btn>
      <v-btn icon class="hidden-md-and-up" @click="favourites()">
        <v-icon v-if="starred">star</v-icon>
        <v-icon v-if="!starred">star_border</v-icon>
      </v-btn>

      <v-btn outline color="indigo" class="mr-3 hidden-sm-and-down" @click="sync()">
        <v-icon left>sync</v-icon>
        Sincronizar
      </v-btn>
      <v-btn icon class="hidden-md-and-up" @click="sync()">
        <v-icon>sync</v-icon>
      </v-btn>

    </v-toolbar>

    <v-content>

      <v-card>
        <v-data-table
          :disable-initial-sort="true"
          :must-sort="true"
          :headers="headers"
          :items="stocks"
          :search="search"
          :rows-per-page-items="[50,100,{ 'text': 'Todos', 'value': -1}]"
          item-key="ticker"
          rows-per-page-text="Por página:"
          no-data-text="Os dados não foram carregados!"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item['ticker'] }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon @click="favourite(props.item)">
                <v-icon color="orange">{{ props.item.star === 1 ? 'star' : 'star_border' }}</v-icon>
              </v-btn>
              <v-btn icon @click="fundamentus(props.item)">
                <v-icon color="teal">link</v-icon>
              </v-btn>
            </td>
            <td class="text-xs-center" style="font-weight: bold; color: #FFF;" :style="props.item['score'] > 7 ? 'background-color: #1B5E20;' : (props.item['score'] < 6 ? 'background-color: #E53935;' : 'background-color: #F9A825')">{{ props.item['score'] }}</td>
            <td class="text-xs-center">{{ props.item['cotacao'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['DY'] > 2.5 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['DY'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['P/VP'] < 2 && props.item['P/VP'] > 0.75 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['P/VP'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['Cresc.5a'] > 5 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['Cresc.5a'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['Div.Brut/Pat.'] < 0.5 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['Div.Brut/Pat.'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['EBITDA'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['EV/EBIT'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['ROE'] > 20 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['ROE'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['ROIC'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['Liq.2m.'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['Liq.Corr.'] > 1.5 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['Liq.Corr.'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['Mrg.Liq.'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['P/Ativ.Circ.Liq.'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['P/Ativo'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['P/Cap.Giro'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['P/EBIT'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['P/L'] < 15 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['P/L'] | formatNumber }}</td>
            <td class="text-xs-center">{{ props.item['PSR'] | formatNumber }}</td>
            <td class="text-xs-center" :style="props.item['Pat.Liq'] > 2000 ? 'background-color: #C8E6C9;' : 'background-color: #FFCDD2;'">{{ props.item['Pat.Liq'] | formatNumber }}</td>
            <td class="text-xs-center">
              <v-icon color="green" v-if="updated(props.item)">cloud_done</v-icon>
              <v-icon color="red" v-if="!updated(props.item)">cloud_off</v-icon>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Sua busca por "{{ search }}" não retornou resultados.
          </v-alert>
        </v-data-table>
      </v-card>

      <confirm-wrapper ref="confirm" />

      <message-wrapper ref="message" />

      <v-dialog v-model="wait" persistent max-width="300px">
        <v-card>
          <v-card-text style="text-align: center;">
            <v-progress-circular :size="100" :width="15" :rotate="360" :value="progress" color="teal">
              {{ progress }}%
            </v-progress-circular>
          </v-card-text>
          <v-card-title class="headline" block style="text-align: center;">Sincronizando... por favor, aguarde!</v-card-title>
        </v-card>
      </v-dialog>

    </v-content>

  </v-app>
</template>

<script>
import manifest from '../../static/manifest.json'
import moment from 'moment'
import axios from 'axios'
import timestamp from 'unix-timestamp'
import numeral from 'numeral'

import MenuWrapper from '../components/Menu.vue'
import ConfirmWrapper from '../components/Confirm.vue'
import MessageWrapper from '../components/Message.vue'

var settings = require('../settings/' + process.env.NODE_ENV + '.json')

export default {
  components: {
    MenuWrapper, ConfirmWrapper, MessageWrapper
  },
  data () {
    return {
      manifest: manifest,
      sidebar: false,
      wait: false,
      progress: 0,
      dialogs: {
        create: false,
        delete: false
      },
      valid: false,
      search: '',
      stocks: [],
      headers: [
        { text: 'Papel', align: 'left', sortable: false, value: 'ticker' },
        { text: '', value: 'actions', sortable: false },
        { text: 'Score', align: 'center', value: 'score' },
        { text: 'Cotação (R$)', align: 'center', value: 'cotacao' },
        { text: 'Dividend Yield (%)', align: 'center', value: 'DY' },
        { text: 'P/VPA', align: 'center', value: 'P/VP' },
        { text: 'Cresc. 5 anos (%)', align: 'center', value: 'Cresc.5a' },
        { text: 'Dív. Bruta/Patr.', align: 'center', value: 'Div.Brut/Pat.' },
        { text: 'EBITDA (%)', align: 'center', value: 'EBITDA' },
        { text: 'EV/EBIT', align: 'center', value: 'EV/EBIT' },
        { text: 'ROE (%)', align: 'center', value: 'ROE' },
        { text: 'ROIC (%)', align: 'center', value: 'ROIC' },
        { text: 'Vol. $ méd. em 2 meses (R$)', align: 'center', value: 'Liq.2m.' },
        { text: 'Líquidez Corr.', align: 'center', value: 'Liq.Corr.' },
        { text: 'Marg. Líq. (%)', align: 'center', value: 'Mrg.Liq.' },
        { text: 'P/Ativ. Círc. Líq.', align: 'center', value: 'P/Ativ.Circ.Liq.' },
        { text: 'P/Ativo', align: 'center', value: 'P/Ativo' },
        { text: 'P/Cap. Giro', align: 'center', value: 'P/Cap.Giro' },
        { text: 'P/EBIT', align: 'center', value: 'P/EBIT' },
        { text: 'P/L', align: 'center', value: 'P/L' },
        { text: 'PSR', align: 'center', value: 'PSR' },
        { text: 'Patr. Líquido (R$)', align: 'center', value: 'Pat.Liq' },
        { text: 'Status', value: 'updated', sortable: false }
      ],
      synchronized: 0,
      starred: false
    }
  },
  mounted () {
    if (!this.$root.$data.trySync) {
      this.refresh()
    } else {
      this.sync()
    }

    this.synchronized = this.$localStorage.get('synchronized')
  },
  methods: {
    refresh () {
      if (this.starred) {
        this.$db.stock
          .where('star').equals(1)
          .reverse().sortBy('score')
          .then(stocks => { this.stocks = stocks })
      } else {
        this.$db.stock
          .reverse().sortBy('score')
          .then(stocks => { this.stocks = stocks })
      }
    },
    sync () {
      this.wait = true

      var self = this

      var err = function (error) {
        console.log(error)

        self.$root.$data.trySync = false

        self.wait = false

        self.refresh()

        self.$refs.message.open('Atenção! Erro ao tentar sincronizar. Por favor, tente novamente mais tarde.', 'error')
      }

      var now = timestamp.now()

      self.progress = 5

      console.log('#1 - Trying to connect in remote server.')

      axios.head(settings.api, { timeout: 10000, withCredentials: false }).then(function (response) {
        self.progress = 20

        console.log('#2 - Trying to get all stocks exchangers.')

        axios.get(settings.api + '/').then((response) => {
          self.progress = 60

          var items = response.data

          var tickers = Object.keys(items)

          console.log('#3 - Saving all items getted from server.')

          var number = function (str) {
            str = str.toString().replace(/[^\d,.-]/g, '')
            str = str.toString().replace('.', '')
            str = str.toString().replace(',', '.')

            return parseFloat(str)
          }

          self.$db.transaction('rw', self.$db.stock, () => {
            tickers.forEach(t => {
              var item = items[t]

              for (var p in item) {
                if (item.hasOwnProperty(p)) {
                  item[p] = number(item[p])
                }
              }

              item.ticker = t
              item.updated = timestamp.toDate(now)

              var score = 0

              score += item['Pat.Liq'] > 2000 ? 1 : 0
              score += item['Liq.Corr.'] > 1.5 ? 1 : 0
              score += item['Div.Brut/Pat.'] < 0.5 ? 1 : 0
              score += item['DY'] > 2.5 ? 1 : 0
              score += item['Cresc.5a'] > 5 ? 1 : 0
              score += item['ROE'] > 20 ? 1 : 0
              score += item['P/VP'] < 2 && item['P/VP'] > 0.75 ? 1 : 0
              score += item['P/L'] < 15 ? 1 : 0
              score += item['P/L'] * item['P/VP'] < 22.5 ? 1 : 0

              if (item['Liq.Corr.'] === 0) {
                score = 0
              }

              item.score = score

              self.$db.stock
                .update(item.ticker, item)
                .then(function (updated) {
                  if (!updated) {
                    item.star = 0

                    self.$db.stock.put(item)
                  }
                })
            })
          }).then(result => {
            console.log('#4 - All done! Updating control variables: ' + timestamp.toDate(now))

            self.$localStorage.set('synchronized', now)

            self.synchronized = now

            self.$root.$data.trySync = false

            self.progress = 100

            self.refresh()

            setTimeout(function () {
              self.wait = false

              self.$refs.message.open('Sincronização realizada com sucesso!', 'success')
            }, 1000)
          }).catch(err)
        }).catch(err)
      }).catch(error => {
        console.log(error)

        self.$root.$data.trySync = false

        self.wait = false

        self.refresh()

        self.$refs.message.open('Atenção! O servidor remoto parece estar indisponível para sincronização dos dados. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde.', 'yellow darken-3', 6000)
      })
    },
    hide (stock) {
      /*
      this.$refs.confirm.open(
        'Apagar Simulação',
        'Tem certeza de que deseja apagar a simulação "' + simulation.name + '"? Esta ação é irreversível!',
        { color: 'red' }).then((confirm) => {
          if (confirm) {
            simulation.active = 0
            simulation.changed = new Date()

            this.$db.simulation.where('code')
              .equals(simulation.code)
              .modify(simulation)
              .then(() => {
                this.refresh()
                this.$refs.message.open('Simulação apagada com sucesso!', 'success')
              })
          }
        })
      */
    },
    fundamentus (stock) {
      window.open('http://www.fundamentus.com.br/detalhes.php?papel=' + stock.ticker)
    },
    favourites () {
      this.starred = !this.starred

      this.refresh()
    },
    favourite (stock) {
      stock.star = stock.star === 1 ? 0 : 1

      this.$db.stock.where('ticker')
        .equals(stock.ticker)
        .modify(stock)
    },
    updated (stock) {
      return this.synchronized === timestamp.fromDate(stock.updated)
    }
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''

      return moment(value).format('D/M/YY HH:mm')
    },
    formatNumber: function (value) {
      return numeral(value).format('0.0')
    }
  }
}
</script>
