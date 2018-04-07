<template>
  <v-app light>

    <v-navigation-drawer fixed clipped v-model="sidebar" app>
      <menu-wrapper @sync="sync"></menu-wrapper>
    </v-navigation-drawer>

    <v-toolbar app clipped-left fixed prominent>
      <v-toolbar-side-icon @click.stop="sidebar = !sidebar" light></v-toolbar-side-icon>
      <v-toolbar-title v-text="!stocks || stocks.length === 0 ? manifest.name : $route.name"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn outline color="indigo" class="mr-3 ml-0 hidden-sm-and-down" v-if="user && user.authenticated" @click="sync()">
        <v-icon left>sync</v-icon>
        Sincronizar
      </v-btn>
      <v-btn icon class="hidden-md-and-up" v-if="user && user.authenticated" @click="sync()">
        <v-icon>sync</v-icon>
      </v-btn>

    </v-toolbar>

    <v-content>

      <v-card>
        <v-card-title>
          Ações
          <v-spacer></v-spacer>
          <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search" />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="stocks"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item['ticker'] }}</td>
            <td class="text-xs-center">{{ props.item['cotacao'] }}</td>
            <td class="text-xs-center">{{ props.item['DY'] }}</td>
            <td class="text-xs-center">{{ props.item['P/VP'] }}</td>
            <td class="text-xs-center">{{ props.item['Div.Brut/Pat.'] }}</td>
            <td class="text-xs-center">{{ props.item['EBITDA'] }}</td>
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
// import { uuid } from 'vue-idb'
import moment from 'moment'
// import axios from 'axios'
// import timestamp from 'unix-timestamp'

import MenuWrapper from '../components/Menu.vue'
import ConfirmWrapper from '../components/Confirm.vue'
import MessageWrapper from '../components/Message.vue'

// var settings = require('../settings/' + process.env.NODE_ENV + '.json')

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
      stocks: [
        {
          'ticker': 'AALR3',
          'Cresc.5a': '13,29%',
          'DY': '0,00%',
          'Div.Brut/Pat.': '0,49',
          'EBITDA': '9,76%',
          'EV/EBIT': '22,26',
          'Liq.2m.': '2.432.290,00',
          'Liq.Corr.': '1,11',
          'Mrg.Liq.': '1,36%',
          'P/Ativ.Circ.Liq.': '-2,99',
          'P/Ativo': '0,802',
          'P/Cap.Giro': '46,42',
          'P/EBIT': '17,44',
          'P/L': '275,64',
          'P/VP': '1,50',
          'PSR': '1,701',
          'Pat.Liq': '1.219.460.000,00',
          'ROE': '0,55%',
          'ROIC': '4,96%',
          'cotacao': '15,50'
        },
        {
          'ticker': 'ABCB4',
          'Cresc.5a': '18,48%',
          'DY': '5,62%',
          'Div.Brut/Pat.': '0,00',
          'EBITDA': '0,00%',
          'EV/EBIT': '0,00',
          'Liq.2m.': '7.353.580,00',
          'Liq.Corr.': '0,00',
          'Mrg.Liq.': '0,00%',
          'P/Ativ.Circ.Liq.': '0,00',
          'P/Ativo': '0,000',
          'P/Cap.Giro': '0,00',
          'P/EBIT': '0,00',
          'P/L': '8,92',
          'P/VP': '1,14',
          'PSR': '0,000',
          'Pat.Liq': '3.284.330.000,00',
          'ROE': '12,75%',
          'ROIC': '0,00%',
          'cotacao': '18,35'
        },
        {
          'ticker': 'ABEV3',
          'Cresc.5a': '8,54%',
          'DY': '2,25%',
          'Div.Brut/Pat.': '0,06',
          'EBITDA': '31,98%',
          'EV/EBIT': '24,15',
          'Liq.2m.': '343.963.000,00',
          'Liq.Corr.': '0,86',
          'Mrg.Liq.': '16,39%',
          'P/Ativ.Circ.Liq.': '-26,70',
          'P/Ativo': '4,350',
          'P/Cap.Giro': '-95,15',
          'P/EBIT': '24,66',
          'P/L': '51,53',
          'P/VP': '8,21',
          'PSR': '7,887',
          'Pat.Liq': '46.008.800.000,00',
          'ROE': '15,94%',
          'ROIC': '23,19%',
          'cotacao': '24,03'
        },
        {
          'ticker': 'ADHM3',
          'Cresc.5a': '0,00%',
          'DY': '0,00%',
          'Div.Brut/Pat.': '0,00',
          'EBITDA': '-26.594,40%',
          'EV/EBIT': '-2,70',
          'Liq.2m.': '15.669,00',
          'Liq.Corr.': '0,05',
          'Mrg.Liq.': '-30.061,10%',
          'P/Ativ.Circ.Liq.': '-1,15',
          'P/Ativo': '5,431',
          'P/Cap.Giro': '-1,73',
          'P/EBIT': '-2,73',
          'P/L': '-2,42',
          'P/VP': '-1,40',
          'PSR': '726,888',
          'Pat.Liq': '-9.328.000,00',
          'ROE': '58,01%',
          'ROIC': '-386,99%',
          'cotacao': '1,73'
        },
        {
          'ticker': 'AELP3',
          'Cresc.5a': '13,13%',
          'DY': '0,00%',
          'Div.Brut/Pat.': '0,00',
          'EBITDA': '0,00%',
          'EV/EBIT': '-219,71',
          'Liq.2m.': '10.550,10',
          'Liq.Corr.': '0,93',
          'Mrg.Liq.': '0,00%',
          'P/Ativ.Circ.Liq.': '-8,57',
          'P/Ativo': '5,992',
          'P/Cap.Giro': '-250,22',
          'P/EBIT': '-230,16',
          'P/L': '1.342,10',
          'P/VP': '-281,20',
          'PSR': '0,000',
          'Pat.Liq': '-735.000,00',
          'ROE': '-20,95%',
          'ROIC': '-3,58%',
          'cotacao': '2,20'
        },
        {
          'ticker': 'AFLT3',
          'Cresc.5a': '-12,27%',
          'DY': '10,17%',
          'Div.Brut/Pat.': '0,06',
          'EBITDA': '53,57%',
          'EV/EBIT': '33,58',
          'Liq.2m.': '1.743,10',
          'Liq.Corr.': '21,59',
          'Mrg.Liq.': '52,94%',
          'P/Ativ.Circ.Liq.': '10,22',
          'P/Ativo': '8,060',
          'P/Cap.Giro': '8,72',
          'P/EBIT': '34,86',
          'P/L': '35,28',
          'P/VP': '9,83',
          'PSR': '18,675',
          'Pat.Liq': '44.935.000,00',
          'ROE': '27,86%',
          'ROIC': '35,97%',
          'cotacao': '7,00'
        },
        {
          'ticker': 'AGRO3',
          'Cresc.5a': '-5,99%',
          'DY': '1,84%',
          'Div.Brut/Pat.': '0,24',
          'EBITDA': '21,98%',
          'EV/EBIT': '19,35',
          'Liq.2m.': '626.827,00',
          'Liq.Corr.': '1,44',
          'Mrg.Liq.': '16,63%',
          'P/Ativ.Circ.Liq.': '-43,35',
          'P/Ativo': '0,810',
          'P/Cap.Giro': '11,59',
          'P/EBIT': '16,20',
          'P/L': '21,42',
          'P/VP': '1,07',
          'PSR': '3,561',
          'Pat.Liq': '693.770.000,00',
          'ROE': '5,02%',
          'ROIC': '5,33%',
          'cotacao': '13,10'
        }
      ],
      search: '',
      headers: [
        { text: 'Ação', align: 'left', sortable: false, value: 'ticker' },
        { text: 'Cotação', align: 'center', value: 'cotacao' },
        { text: 'Dividend Yield', align: 'center', value: 'DY' },
        { text: 'P/VPA', align: 'center', value: 'P/VP' },
        { text: 'Div.Brut/Pat.', align: 'center', value: 'Div.Brut/Pat.' },
        { text: 'EBITDA', align: 'center', value: 'EBITDA' }
      ]
    }
  },
  mounted () {
    if (!this.$root.$data.trySync) {
      this.refresh()
    } else {
      this.sync()
    }
  },
  methods: {
    refresh () {
      this.$db.stocks
        .where('active').equals(1)
        .then(stocks => { this.stocks = stocks })
    },
    sync () {
      /*
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

      var ts = this.$localStorage.get('synchronized')

      var lastSync = timestamp.toDate(ts)

      self.progress = 5

      console.log('#1 - Trying to connect in remote server.')

      axios.get(settings.api + '/status', { timeout: 2000 }).then(function (response) {
        self.progress = 15

        console.log('#2 - Getting from local DB all items edited from last sync: ' + lastSync)

        self.$db.simulation
          .where('changed').above(lastSync).toArray()
          .then(simulations => {
            let promises = []

            simulations.forEach(s => {
              promises.push(axios.post(settings.api + '/simulation', s, { headers: { Authorization: 'Bearer ' + self.user.token } }))
            })

            console.log('#3 - Sending all items edited from last sync: ' + promises.length)

            axios.all(promises).then(function (results) {
              results.forEach(r => {
                console.log(r.data)
              })

              self.progress = 50

              console.log('#4 - Geting all items in server from last sync. Last sync in timestamp: ' + timestamp.fromDate(lastSync))

              axios.get(settings.api + '/simulations/' + timestamp.fromDate(lastSync), { headers: { Authorization: 'Bearer ' + self.user.token } }).then((response) => {
                self.progress = 80

                var items = response.data

                items.forEach(i => {
                  console.log('Getted: ' + i.code + '!')
                })

                console.log('#5 - Saving all items getted from server and deleting inactivated items.')

                self.$db.transaction('rw', self.$db.simulation, () => {
                  items.forEach(d => {
                    d.created = new Date(d.created)
                    d.changed = new Date(d.changed)

                    self.$db.simulation.put(d)
                  })

                  self.$db.simulation.where('active').equals(0).delete()
                }).then(result => {
                  console.log('#6 - All done! Updating control variables: ' + timestamp.toDate(now))

                  self.$localStorage.set('synchronized', now)

                  self.$root.$data.trySync = false

                  self.progress = 100

                  self.refresh()

                  setTimeout(function () {
                    self.wait = false

                    self.$refs.message.open('Sincronização realizada com sucesso!', 'success')
                  }, 1000)
                }).catch(err)
              }).catch(err)
            }).catch(err)
          }).catch(err)
      }).catch(error => {
        console.log(error)

        self.$root.$data.trySync = false

        self.wait = false

        self.refresh()

        self.$refs.message.open('Atenção! O servidor remoto parece estar indisponível para sincronização dos dados. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde.', 'yellow darken-3', 6000)
      })
      */
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
    }
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''

      return moment(value).format('D/M/YY HH:mm')
    }
  }
}
</script>
