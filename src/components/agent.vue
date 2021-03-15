<template>
  <div class="tile is-parent">
    <!-- provision complete -->
    <article
    v-if="isProvisionStarted || isProvisionComplete"
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <p class="title" style="white-space: nowrap;">
        {{ agent.name }}
      </p>

      <p class="subtitle" style="white-space: nowrap;">
        {{ agent.description }}
      </p>

      <img :src="agent.picture" style="width: 128px; height: 128px;">

      <p v-if="isProvisionComplete">
        <strong style="white-space:nowrap">
          Username:
          {{ agent.username }}
        </strong>
        <copy :value="agent.username" name="Username" />
      </p>

      <p v-if="isProvisionComplete">
        <strong>
          Password:
          {{ agent.password }}
        </strong>
        <copy :value="agent.password" name="Password" />
      </p>
      <p v-if="isProvisionStarted">
        <strong>
          Status: Provisioning...
        </strong>
      </p>
    </article>

    <!-- not provisioned -->
    <article
    v-else
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- provision button -->
      <b-button
      type="is-success"
      rounded
      expanded
      :disabled="isWorking"
      @click="clickProvision"
      >
        Provision Me for {{ verticalName }}
      </b-button>
    </article>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    agent: {
      required: true,
      type: Object
    },
    vertical: {
      type: String,
      required: true
    }
  },
  
  computed: {
    ...mapGetters([
      'provisionStatus',
      'verticals'
    ]),
    isProvisionComplete () {
      return this.verticalProvisionStatus === 'complete'
    },
    isProvisionStarted () {
      return this.verticalProvisionStatus === 'started'
    },
    verticalProvisionStatus () {
      try {
        return this.provisionStatus[this.vertical][this.agent.role.toLowerCase()]
      } catch (e) {
        return null
      }
    },
    verticalName () {
      return this.verticals[this.vertical].name
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>