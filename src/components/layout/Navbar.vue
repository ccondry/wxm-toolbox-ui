<template>
  <b-navbar class="app-navbar">
        <template slot="start">
          <!-- <b-navbar-dropdown label="dCloud Toolbox - Cisco Webex Contact Center v2">
              <b-navbar-item v-for="(link, index) of links" :href="link.href" :key="index">
                  {{ link.text }}
              </b-navbar-item>
          </b-navbar-dropdown> -->
          <b-navbar-item tag="div">
            <a href="/">dCloud Toolbox</a>&nbsp;- Cisco Webex Contact Center v2
          </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div" v-if="authenticated">
              {{ user.username }} ({{ user.id }})&nbsp;&nbsp;
              <a @click="clickLogout">Log Out</a>
            </b-navbar-item>
            <b-navbar-item tag="div" v-else>
              <a @click="clickLogin">Log in</a>
            </b-navbar-item>
        </template>
    </b-navbar>
    <!--
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
        </div>
        <div class="nav-center">
          <nav class="level">
            <div class="level-item">
              <p>
                <a href="/">dCloud Toolbox</a>
                - Cisco Webex Contact Center
              </p>
            </div>
          </nav>
        </div>
        <div class="nav-right is-flex">
          <span v-if="authenticated" class="nav-item">{{ user.username }} ({{ user.id }})</span>
          <a v-if="authenticated" @click="clickLogout" class="nav-item">Logout</a>
          <a v-if="!authenticated && !isProduction" @click="clickLogin" class="nav-item">Login</a>
        </div>
      </nav>
    </div>
  </section> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      filter: ''
    }
  },

  props: {
    show: Boolean,
    menuFilter: String
  },

  mount () {
    if (!this.authenticated && !this.isProduction) {
      // pop development login modal
      this.clickLogin()
    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'authenticated',
      'user',
      'instance',
      'currentInstance',
      'isProduction',
      'isCxdemo',
      'isDcloud'
    ]),
    links () {
      // the list of navigation links to show this user
      const ret = []
      // show customer profiles and branding to everyone
      ret.push({
        href: '/customer',
        text: 'Customer Profiles'
      })
      ret.push({
        href: '/branding',
        text: 'Demo Branding'
      })

      // only show dCloud CC demos if on dcloud.cisco.com domain. but show all to admins.
      if (this.isDcloud || this.user.admin) {
        ret.push({
          href: '/pcce',
          text: 'Packaged Contact Center Enterprise 11.6v3 Instant Demo'
        })
        ret.push({
          href: '/uccx',
          text: 'Unified Contact Center Express 12.0v2 Instant Demo'
        })
        ret.push({
          href: '/cwcc',
          text: 'Webex Contact Center v2 Instant Demo'
        })
      }

      // only show cxdemo demos if on cxdemo.net domain.
      if (this.isCxdemo) {
        ret.push({
          href: '/chat',
          text: 'Facebook & SMS Entry Points'
        })
        ret.push({
          href: '/cjp-ccone',
          text: 'CJP CCOne Demo'
        })
        ret.push({
          href: '/cjp-webex',
          text: 'CJP Webex Demo'
        })
        ret.push({
          href: '/cwcc-tsa',
          text: 'CWCC TSA Demo'
        })
      }
      if (this.user.admin || this.user.isSupport) {
        ret.push({
          href: '/management',
          text: 'Management and Administration'
        })
      }
      // return list
      return ret
    },

    userPage () {
      if (this.isProduction) {
        return '/auth/user'
      } else {
        return 'http://localhost:8085/auth/user/right'
      }
    },
    currentDatacenter () {
      try {
        return this.currentInstance.datacenter
      } catch (e) {
        return ''
      }
    },
    currentSession () {
      try {
        return this.currentInstance.session
      } catch (e) {
        return ''
      }
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'setJwt'
    ]),
    clickLogout () {
      this.logout()
    },
    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT`,
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
    filter (val) {
      this.$emit('update:menuFilter', val)
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~bulma/bulma';
// @import '~bulma/sass/utilities/variables';

.app-navbar {
  color: #28374B;
  font-weight: bold;
  a {
    color: #7957d5;
  }
  position: fixed;
  min-width: 100%;
  z-index: 4;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .nav {
    min-height: 0em;
  }

  .container {
    // margin: auto 10px;
  }

  // .nav-right {
  //   align-items: stretch;
  //   align-items: stretch;
  //   flex: 1;
  //   justify-content: flex-end;
  //   overflow: hidden;
  //   overflow-x: auto;
  //   white-space: nowrap;
  // }
}

.hero-head {

  // .vue {
  //   margin-left: 10px;
  //   color: #36AC70;
  // }
  // .admin {
  // }
}
</style>
