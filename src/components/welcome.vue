<template>
  <panel :title="`Welcome ${jwtUser.firstName}!`" aria-id="welcome">
    <p>
      Welcome to the Cisco Webex Experience Management v2 Demo on
      dCloud.
    </p>
    <p>
      Join our Webex Teams support room to get help, ask questions, and
      suggest new features:
    </p>
    <div class="buttons" style="justify-content: space-around;">
      <b-field>
        <b-button
        type="is-primary"
        rounded
        @click="clickJoinSupportRoom"
        >
          Join Support Room
        </b-button>
      </b-field>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'jwtUser'
    ])
  },

  methods: {
    ...mapActions([
      'joinSupportRoom'
    ]),
    clickJoinSupportRoom () {
      this.$buefy.dialog.prompt({
        title: 'Join Webex Teams Support Room',
        message: `What email address do you use for Webex Teams?`,
        rounded: true,
        confirmText: 'Submit',
        type: 'is-success',
        inputAttrs: {
          value: this.jwtUser.email,
          placeholder: 'Your Webex Teams Email Address'
        },
        onConfirm: (email) => {
          this.joinSupportRoom(email)
        }
      })
    }
  }
}
</script>