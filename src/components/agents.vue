<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile">
        <!-- repeat this tile for each agent -->
        <div class="tile is-parent" v-for="agent of agents">
          <article class="tile is-child box">

            <p class="title">{{ agent.name }}</p>
            <p class="subtitle">{{ agent.role }}</p>
            <img :src="agent.picture" width="128px">
            <p>
              <strong>Username: {{ agent.username }}</strong>
              <a @click="clickCopy(agent.username, 'Username')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Password: {{ agent.password }}</strong>
              <a @click="clickCopy(agent.password, 'Password')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Extension: {{ agent.extension }}</strong>
              <a @click="clickCopy(agent.extension, 'Extension')"><b-icon icon="layers"></b-icon></a>
            </p>
          </article>
        </div>

      </div>
    </div>
    <center>
      <b-field>
        <button class="button is-success" @click="clickPortal">Go to Webex Contact Center Portal</button>
      </b-field>
    </center>

    <input type="hidden" id="clipboard" :value="clipboard">

  </div>
</template>


<script>
export default {
  props: ['user'],

  data () {
    return {
      portalUrl: 'https://portal.ccone.net',
      clipboard: 'initial-value'
    }
  },

  computed: {
    agents () {
      return [
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/author1.png',
          username: 'sjeffers' + this.user.id + '@dcloud.cisco.com',
          password: 'C1sco12345',
          extension: '1080' + this.user.id,
          name: 'Sandra Jefferson',
          role: 'Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/author3.png',
          username: 'rbarrows' + this.user.id + '@dcloud.cisco.com',
          password: 'C1sco12345',
          extension: '1082' + this.user.id,
          name: 'Rick Barrows',
          role: 'Administrator / Agent'
        }
      ]
    }
  },

  methods: {
    clickPortal (e) {
      // open agent portal in new tab, or same tab if they have it open already
      window.open(this.portalUrl, 'ccone')
    },
    clickCopy (s, type) {
      // copy text to clipboard
      // const input = document.createElement('input')
      const input = document.getElementById('copy-paste')
      // document.body.appendChild(input)
      input.value = s
      input.focus()
      input.select()
      const result = document.execCommand('copy')
      // input.remove
      input.value = ''
      // document.body.removeChild(input)
      if (result === 'unsuccessful') {
        // failed
        console.error('Failed to copy text.')
      } else {
        this.$buefy.toast.open({
          message: type + ' Copied to Your Clipboard',
          queue: false
        })
      }
    }
  }
}
</script>
