<template>
  <section class="main">
    <!-- welcome -->
    <welcome />

    <!-- the available agents in each vertical/tenant -->
    <agents vertical="bank" />
    <agents vertical="heal" />
    <agents vertical="product" />
    <agents vertical="retail" />

    <!-- Copyright and version footer -->
    <app-footer style="margin-bottom: 1rem;" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import Welcome from '../components/welcome'
import Agents from '../components/agents'
import AppFooter from '../components/app-footer'

export default {
  components: {
    Welcome,
    Agents,
    AppFooter
  },

  data () {
    return {
      password: '',
      dn: '',
      moment
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'loading',
      'working',
      'instance',
      'demoBaseConfig',
      'isProvisioned',
      'isLocked',
      'demoUserConfig'
    ])
  },

  methods: {
    ...mapActions([
    ]),
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clicksetUserPassword () {
      this.$buefy.dialog.prompt({
        title: 'Reset Password',
        message: 'Choose your new password',
        inputAttrs: {
          type: 'password',
          placeholder: 'Your New Password',
          'aria-placeholder': 'Your New Password'
        },
        confirmText: 'Submit',
        rounded: true,
        onConfirm: (password) => {
          this.setUserPassword({
            username: this.jwtUser.sub,
            password
          })
        },
        type: 'is-success'
      })
    }
  }
}
</script>
