<template>

  <v-app light>

    <v-toolbar app clipped-left fixed prominent>

      <v-btn icon @click.native="cancel">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <v-toolbar-title v-text="$route.name"></v-toolbar-title>

      <v-spacer></v-spacer>

    </v-toolbar>

    <v-content>

    </v-content>

  </v-app>

</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    cancel () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
