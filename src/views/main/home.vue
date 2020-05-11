<template>
  <div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Welcome</h1>
          <b-field>
            <p>
              Welcome to the Cisco Webex Experience Management Demo on dCloud.
            </p>
          </b-field>
          <b-field>
            <p>
              Click this button to get support, ask questions, and suggest
              new features:
            </p>
          </b-field>
          <b-field>
            <button class="button is-success" @click.prevent="showSupportRoomDialog" >
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
              <button class="button is-success" 
              @click.prevent="showProvisionDialog" 
              :disabled="working.user.provision">
               {{ working.user.provision ? `Working - ${provisionTime}` : 'Yes, Provision Me' }}
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
              <button class="button is-success" 
              @click.prevent="showProvisionDialog" 
              :disabled="working.user.provision">
                {{ working.user.provision ? `Working - ${provisionTime}` : 'Yes, Provision Me Anyway' }}
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
      showMore: false,
      timerEnd: 0,
      timerNow: 0
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
    startTimer () {
      // advance the timer every 1 second
      setInterval(() => {
        this.timerNow = new Date().getTime()
      }, 1000)
    },
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
    showSupportRoomDialog (event) {
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
    showProvisionDialog (event) {
      // show dialog
      this.$buefy.dialog.prompt({
        title: 'Provision',
        message: `What is your corporate email address?`,
        type: 'is-success',
        confirmText: 'Start Provision',
        inputAttrs: {
          placeholder: 'username@example.com',
          value: this.user.email
        },
        onConfirm: (email) => {
          this.provisionUser({email})
          // reprovision or first time?
          if (this.isProvisioned) {
            // reprovision
            // set timer for working estimate
            // 8 seconds in milliseconds
            this.timerEnd = new Date().getTime() + 8 * 1000
            this.startTimer()
          } else {
            // first provision
            // set timer for working estimate
            // 30 seconds in milliseconds
            this.timerEnd = new Date().getTime() + 30 * 1000
            this.startTimer()
          }
        }
      })
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
    timeLeft () {
      // returns the estimated time remaining to complete provisioning
      // const now = new Date().getTime()
      const timeLeft = this.timerEnd - this.timerNow
      return Math.ceil(timeLeft / 1000)
    },
    provisionTime () {
      if (this.timeLeft < 0) {
        return 'Almost done...'
      } else if (this.timeLeft > 500) {
        // validate sane output
        // over 500 is probably wrong... so say something else
        return `Estimating time remaining...`
      } else {
        return `About ${this.timeLeft} seconds remaining...`
      }
    },
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
