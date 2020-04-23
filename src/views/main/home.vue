<template>
  <div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Welcome</h1>
          <b-field>
            <p>
              Welcome to the Cisco Webex Contact Center Demo on dCloud.
            </p>
          </b-field>
          <b-field>
            <p>
              Click this button to get support, ask questions, and suggest
              new features:
            </p>
          </b-field>
          <b-field>
            <button class="button is-success" @click.prevent="showDialog" >
              Join Support Room
            </button>
          </b-field>
        </article>
      </div>
    </div>

    <div v-if="loading.user.provision">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Loading...</h1>
          </article>
        </div>
      </div>
    </div>

    <div v-if="!loading.user.provision">
      <!-- done loading -->
      <div class="tile is-ancestor" v-if="!isProvisioned">
        <!-- user not provisioned - show provision button -->
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Start</h1>
            <b-field>
              <p>
                Your account is not provisioned for this demo yet. Would you like
                to provision it now?
              </p>
            </b-field>
            <b-field>
              <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
                {{ working.user.provision ? 'Working...' : 'Yes, Provision Me' }}
              </button>
            </b-field>
          </article>
        </div>
      </div>

      <!-- user is provisioned - show agent info -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent">
          <article class="tile is-child box is-horizontal">
            <h1 class="title">Agents</h1>
            <div class="content">
              <agents :user="user" />
            </div>
          </article>
        </div>
      </div>

      <!-- Demo Website config -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child box">
            <h1 class="title">
              Demo Website
            </h1>
            <div class="content">
              <div class="select">
                <select class="input" v-model="vertical" @change="verticalChanged" :disabled="working.app.user">
                  <option value="" disabled selected>Choose Your Demo Vertical</option>
                  <option v-for="brand in systemBrands" :value="brand.id">{{ `${brand.name} (${brand.id})` }}</option>
                  <option disabled>-----------------------------------------</option>
                  <option v-for="brand in userBrands" :value="brand.id" v-if="brandFilter === 'all'">{{ `${brand.name} (${brand.id})` }}</option>
                  <option v-for="brand in myBrands" :value="brand.id" v-if="brandFilter === 'mine'">{{ `${brand.name} (${brand.id})` }}</option>
                  <option v-for="brand in filteredSortedBrands" :value="brand.id" v-if="brandFilter === 'other'">{{ `${brand.name} (${brand.id})` }}</option>
                </select>
              </div>
              &nbsp;
              <button class="button is-success" @click="clickGo" :disabled="working.app.user">Go to Demo Website</button>
              &nbsp;
              <span style="font-size: 1.3em;">Or for quick access, call {{ working.app.user ? 'Loading...' : demoNumber }}</span>
              <b-field>
                <b-checkbox v-model="showMore">Show More</b-checkbox>
              </b-field>
              <b-field v-show="showMore">
                <div class="field">
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    v-if="user.admin"
                    native-value="all">Show all verticals</b-radio>
                  </div>
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    native-value="mine">Show my verticals</b-radio>
                  </div>
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    native-value="other">
                    <span style="float: left;">Show this user's verticals:</span>
                    <b-autocomplete
                      v-model="ownerFilter"
                      :data="autocompleteOwners">
                      <template slot="empty">No results found</template>
                    </b-autocomplete>
                  </b-radio>
                  </div>
                </div>
              </b-field>
                <p>
                  Note: You can create and configure your own vertical on the
                <a href="/branding" target="brand-toolbox">
                  <strong>Demo Branding Toolbox</strong>
                </a>.
              </p>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="isProvisioned">
        <!-- user not provisioned - show provision button -->
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Reprovision</h1>
            <b-field>
              <p>
                Your account is already provisioned for this demo, but you can
                run it again if you need to. Would you like to provision again
                anyway?
              </p>
            </b-field>
            <b-field>
              <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
                {{ working.user.provision ? 'Working...' : 'Yes, Provision Me Anyway' }}
              </button>
            </b-field>
          </article>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Agents from '../../components/agents.vue'

export default {
  components: {
    Agents
  },

  data () {
    return {
      ownerFilter: '',
      brandFilter: 'mine',
      vertical: 'finance',
      showMore: false
    }
  },

  mounted () {
  },

  methods: {
    ...mapActions([
      'inviteToSupportRoom',
      'getProvisionStatus',
      'provisionUser',
      'saveDemoConfig'
    ]),
    verticalChanged (e) {
      console.log('vertical changed', e.target.value)
      // construct data body to send to API
      const data = {
        vertical: e.target.value
      }
      // save vertical
      this.saveDemoConfig({
        data,
        showNotification: false
      })
      // await this.loadDemoConfig(false)
    },
    clickGo (e) {
      console.log('user clicked button to go to demo website')
      window.open(this.brandDemoLink, 'brand')
    },
    showDialog (event) {
      // show dialog
      this.$buefy.dialog.prompt({
        title: 'Join the Webex Teams support room',
        message: `What is your Webex Teams email address?`,
        type: 'is-success',
        confirmText: 'Join',
        inputAttrs: {
          placeholder: 'username@example.com',
          value: this.user.email
        },
        onConfirm: (email) => {
          this.inviteToSupportRoom({email})
        }
      })
    },
    async clickProvision () {
      console.log('user clicked Provision Me button')
      try {
        await this.provisionUser()
        // after provision starts, notify the user they need to request
        // manual chat provisioning
        this.$buefy.dialog.alert({
          title: 'Contact Support to Complete Provisioning',
          message: `Please send a message to the Webex Teams support room
          to complete provisioning, and please include your 4-digit user ID.
          Please allow 24-48 hours for this to be completed by the support team.
          You will not be able to log in your agents to the demo until
          provisioning is completed by the support team.`,
          type: 'is-default',
          confirmText: 'Ok'
        })
      } catch (e) {
        throw e
      }
    },
    getDid (name) {
      try {
        return this.dcloudSession.dids.find(v => v.name === name).number
      } catch (e) {
        return ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'isProvisioned',
      'loading',
      'working',
      'verticals',
      'brandDemoLink',
      'dcloudSession',
      'demoConfig'
    ]),
    demoNumber () {
      switch (this.vertical) {
        case 'city': return this.getDid('DID5')
        case 'healthcare': return this.getDid('DID9')
        case 'utility': return this.getDid('DID10')
        case 'finance': return this.getDid('DID7')
        case 'travel': return this.getDid('DID8')
        default: return this.getDid('DID7')
      }
    },
    disableSave () {
      return false
    },
    autocompleteOwners () {
      const allOwners = this.verticals.map(v => v.owner)
      const uniqueOwners = Array.from(new Set(allOwners))
      return uniqueOwners.filter((option) => {
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.ownerFilter.toLowerCase()) >= 0
      })
    },
    sortedBrands () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted brands`, e)
      }
    },
    systemBrands () {
      return this.sortedBrands.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    userBrands () {
      return this.sortedBrands.filter(v => v.owner && v.owner !== 'system' && v.owner !== null)
    },
    myBrands () {
      return this.sortedBrands.filter(v => v.owner === this.user.username)
    },
    filteredSortedBrands () {
      // filter to only show the brands owned by specified user
      return this.sortedBrands.filter(v => v.owner === this.ownerFilter)
    }
  },

  watch: {
    demoConfig (val) {
      // copy vertical selection to the one in demo config
      this.vertical = val.vertical
    },
    vertical (val) {
      const selectedVertical = this.sortedBrands.find(v => {
        return v.id === val
      })
      // is this selected vertical owned by someone else?
      if (selectedVertical && selectedVertical.owner !== 'system' &&
      selectedVertical.owner !== this.user.username) {
        // selected vertical owned by a user that is not this user
        this.brandFilter = 'other'
        this.ownerFilter = selectedVertical.owner
      }
    }
  }
}
</script>
