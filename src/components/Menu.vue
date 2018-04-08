<template>

  <v-list>

    <v-card color="blue-grey darken-2" class="white--text mx-2">
      <v-card-title class="justify-center" style="text-align: center;">
        <strong>Atenção!</strong> Os dados mostrados foram sincronizados do site
        <a href="http://fundamentus.com.br" target="_blank" class="white--text">Fundamentus</a>&nbsp;
        em:
        <v-chip color="orange" text-color="white" class="mt-3">
          <v-avatar>
            <v-icon>schedule</v-icon>
          </v-avatar>
          {{ synchronized | format }}
        </v-chip>
      </v-card-title>
      <v-card-actions>
        <v-btn outline color="white" block @click="sync()">
          <v-icon left>sync</v-icon>
          Sincronizar Agora
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-divider class="mt-2"></v-divider>

    <v-list-tile exact v-for="item in menu" :key="item.title" @click="item.go()">
      <v-list-tile-action>
        <v-icon v-html="item.icon"></v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title v-text="item.name"></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>

</template>

<script>
import moment from 'moment'
import timestamp from 'unix-timestamp'

export default {
  props: ['synchronized'],
  data () {
    var self = this

    return {
      menu: [
        { icon: 'poll', name: 'Ações', go () { self.$router.push('/') } },
        { icon: 'help', name: 'Ajuda', go () { self.$router.push('/help') } },
        { icon: 'settings', name: 'Configurações', go () { self.$router.push('/settings') } },
        { icon: 'bug_report', name: 'Reportar Problema', go () { alert('TODO: Send Mail') } },
        { icon: 'info', name: 'Sobre', go () { self.$router.push('/about') } }
      ]
    }
  },
  methods: {
    sync () {
      this.$emit('sync')
    }
  },
  filters: {
    format: function (value) {
      if (!value) return 'Nunca houve sincronização!'

      return moment(timestamp.toDate(value)).format('D/M/YY HH:mm')
    }
  }
}
</script>

