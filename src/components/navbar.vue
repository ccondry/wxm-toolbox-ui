<template>
  <b-navbar
  :transparent="true"
  :fixed-top="true"
  style="background-color: rgba(0, 0, 0, 0)"
  >
    <template slot="start">
      <b-field class="navbar-item">
        <b-button
        type="is-info"
        rounded
        tag="a"
        href="/"
        >
          Toolbox Home
        </b-button>
      </b-field>
    </template>

    <template slot="end">
      <div class="navbar-item">
        <div class="buttons">
          <b-button
          v-if="isAdmin"
          type="is-info"
          rounded
          @click="clickAdmin"
          >
            Admin
          </b-button>

          <b-button
          v-if="isAdminSu"
          type="is-info"
          rounded
          @click="clickLogout"
          >
            Log Out
          </b-button>
        </div>
      </div>
    </template>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isAdmin',
      'isAdminSu'
    ])
  },
  
  methods: {
    ...mapActions([
      'logout'
    ]),
    clickLogout () {
      this.logout()
    },
    clickAdmin () {
      window.location = '/management'
    }
  }
}
</script>