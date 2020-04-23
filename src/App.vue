<template>
  <div>
    <b-loading :is-full-page="true" :active="!authCheckDone" :can-cancel="false"></b-loading>
    <div v-if="authenticated">
      <!-- endpoints have not finished loading yet -->
      <b-loading :is-full-page="true" :active="!authCheckDone" :can-cancel="false"></b-loading>
      <div v-if="authCheckDone">
        <!-- <nprogress-container></nprogress-container> -->
        <navbar :show="true"></navbar>
        <sidebar :show="sidebar.opened && !sidebar.hidden"></sidebar>
        <app-main></app-main>
      </div>
    </div>
    <!-- this is for copy/paste javascript code -->
    <input id="copy-paste" />
  </div>
</template>


<script>
// import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import AppMain from './components/layout/AppMain'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      production: process.env.NODE_ENV === 'production',
      authCheckDone: false
    }
  },

  components: {
    Navbar,
    Sidebar,
    AppMain
    // NprogressContainer
  },

  beforeMount () {
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width - RATIO < WIDTH
        this.toggleDevice(isMobile ? 'mobile' : 'other')
        this.toggleSidebar({
          opened: !isMobile
        })
      }
    }

    // add event listeners for DOM events
    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)
  },

  mounted () {
    this.authCheck().then(r => {
      // auth check done
      // are they logged in?
      if (this.authenticated === true) {
        // get their provision status
        this.getProvisionStatus(false)
        // and get dcloud session info
        this.getDcloudSession(false)
        // and get verticals list
        this.loadVerticals(false)
        // and get user demo config
        this.loadDemoConfig(false)
      }
    })
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'authEnabled',
      'authenticated',
      'loading',
      'endpoints',
      'endpointsLoaded'
    ])
  },

  methods: {
    ...mapActions([
      'toggleDevice',
      'toggleSidebar',
      'checkLogin',
      // 'getEndpoints',
      'getDcloudSession',
      'setJwt',
      'getProvisionStatus',
      'loadVerticals',
      'loadDemoConfig'
    ]),
    async authCheck () {
      try {
        // console.log('getting endpoints...')
        // await this.getEndpoints(false)
        // console.log('getting endpoints done.')

        // check the JWT in localstorage to see if the user is already logged in
        console.log('checking login...')
        await this.checkLogin()
        console.log('checking login done.')
        this.authCheckDone = true
        if (this.authenticated === false) {
          // user is not authenticated - send them to login
          if (this.production) {
            // production - redirect to login page
            window.location = '/auth/login?destination=' + window.location
          } else {
            // development - pop JWT form
            this.clickLogin()
          }
        }
      } catch (e) {
        console.log('failed to get endpoints and check login:', e.message)
      }
    },
    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT to log in`,
        inputAttrs: {
          placeholder: 'JWT'
        },
        onConfirm: (value) => {
          this.setJwt(value)
        }
      })
    }
  },
  watch: {
    async authenticated (val, oldVal) {
      // if user goes from logged in to logged out, forward them to the login page
      if (oldVal === true && val === false) {
        if (this.production) {
          // production - redirect to login page
          window.location = '/auth/login?destination=' + window.location
        } else {
          // development - pop JWT form
          this.clickLogin()
        }
      }
    }
  }
}
</script>

<style lang="scss">
// @import '~animate.css';
// .animated {
//   animation-duration: .377s;
// }

// @import '~bulma';

// $fa-font-path: '~font-awesome/fonts/';
// @import '~font-awesome/scss/font-awesome';

html {
  // background-color: whitesmoke;
}

// .nprogress-container {
//   position: fixed !important;
//   width: 100%;
//   height: 50px;
//   z-index: 2048;
//   pointer-events: none;
//
//   #nprogress {
//     $color: #48e79a;
//
//     .bar {
//       background: $color;
//     }
//     .peg {
//       box-shadow: 0 0 10px $color, 0 0 5px $color;
//     }
//
//     .spinner-icon {
//       border-top-color: $color;
//       border-left-color: $color;
//     }
//   }
// }
</style>
