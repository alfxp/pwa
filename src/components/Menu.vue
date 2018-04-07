<template>

  <v-list>
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
export default {
  data () {
    var self = this

    return {
      menu: [
        { icon: 'poll', name: 'Simulações', go () { self.$router.push('/') } },
        { icon: 'sync', name: 'Sincronizar', go () { self.$emit('sync') } },
        { icon: 'settings', name: 'Configurações', go () { self.$router.push('/settings') } },
        { icon: 'bug_report', name: 'Reportar Problema', go () { alert('TODO: Send Mail') } },
        { icon: 'info', name: 'Sobre', go () { self.$router.push('/about') } }
      ]
    }
  }
}
</script>

