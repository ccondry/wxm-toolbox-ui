<template>
  <panel
  :title="`${verticalName} Personas`"
  aria-id="agents"
  >
    <!-- loading -->
    <div
    v-if="isLoading"
    style="height: 4rem; width: 18rem;"
    >
      <b-loading
      :active="true"
      :is-full-page="false"
      />
    </div>

    <!-- working -->
    <b-loading
    :active="isWorking"
    :is-full-page="false"
    />

    <!-- agents are provisioned -->
    <div v-if="!isLoading && isProvisioned">
      <!-- agent panels -->
      <div style="display: flex; flex-wrap: wrap;">
        <agent
        v-for="(agent, i) of agents"
        :key="i"
        :agent="agent"
        />
      </div>
      <!-- portal button -->
      <div class="buttons" style="justify-content: space-around;">
        <b-field>
          <a
          href="https://cx.cloudcherry.com/"
          target="_blank"
          class="button is-primary is-rounded is-fullwidth"
          >
            Go to Webex Experience Mangement Portal
          </a>
        </b-field>
      </div>
    </div>

    <!-- agents are not provisioned -->
    <div v-if="!isLoading && !isProvisioned">
      <b-button
      type="is-success"
      rounded
      expanded
      :disabled="isWorking"
      @click="clickProvision"
      >
        Provision Me for {{ verticalName }}
      </b-button>
    </div>
  </panel>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Agent from './agent'

export default {
  components: {
    Agent
  },

  props: {
    vertical: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      // 'agents',
      'verticals',
      'jwtUser',
      'provisionStatus',
      'loading',
      'working'
    ]),
    isWorking () {
      return this.working.provision[this.vertical]
      // return true
    },
    isLoading () {
      return this.loading.provision[this.vertical]
      // return true
    },
    isProvisioned () {
      return this.provisionStatus[this.vertical].length === 2
    },
    agents () {
      const imageFolder = 'https://mm.cxdemo.net/static/images/cumulus/common'
      return [{
        picture: imageFolder + '/sandra.png',
        username: 'dcwxm' + this.vertical + 'sjeffers' + this.jwtUser.id,
        password: 'C1sco12345!',
        name: 'Sandra Jefferson',
        role: 'Agent',
        description: 'Contact Center Agent'
      }, {
        picture: imageFolder + '/rick.png',
        username: 'dcwxm' + this.vertical + 'rbarrows' + this.jwtUser.id,
        password: 'C1sco12345!',
        name: 'Rick Barrows',
        role: 'Supervisor',
        description: 'CX Lead'
      }]
    },
    verticalName () {
      return this.verticals[this.vertical].name
    }
  },

  methods: {
    ...mapActions([
      'provisionUser'
    ]),
    clickProvision () {
      this.provisionUser(this.vertical)
    }
  }
}
</script>
