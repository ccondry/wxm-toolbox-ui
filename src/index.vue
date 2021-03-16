<template>
  <div>
    <!-- top navbar -->
    <navbar />
    <!-- loading -->
    <!-- <b-loading :active="isLoading" :is-full-page="true" /> -->
    <!-- main -->
    <div
    v-if="isLoggedIn"
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <!-- vue-router container -->
      <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Navbar from './components/navbar'

export default {
  components: {
    Navbar
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'jwtUser',
      'sessionId',
      // 'loading'
    ])
    // isLoading () {
    //   return this.loading.app.version
    // }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in. get provision status info.
        this.getProvision()
      } else if (!val && oldVal) {
        // user just logged out. make them log in again.
        this.login()
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
    // get the REST API version
    this.getApiVersion()
    // get the auth REST API version
    this.getAuthApiVersion()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getApiVersion',
      'getAuthApiVersion',
      'login',
      'getProvision'
    ]),
    clickAdmin () {
      // navigate user to the toolbox management website
      window.location = '/management'
    },
    clickHome () {
      // navitagate to the toolbox landing page
      window.location = '/'
    }
  }
}
</script>

<style lang="scss">
// hide scroll bar
html, body {
  background-image: url(./assets/images/sign_in_background.jpg);
  // background-position: 0 0;
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

// make container fill viewport
#main-container {
  height: 100vh;
  padding-top: 1rem;
}

// each route content container class - centered
section.main {
  // flex layout
  display: flex;
  // keep small amounts of content vertically centered
  min-height: 100%;
  justify-content: center;
  // center panels horizontally
  align-items: center;
  // put content in a column down the page
  flex-direction: column;
}

section.main > div {
  // padding-bottom: 1rem;
}

// give content panels a grey border and darker box shadow

</style>
