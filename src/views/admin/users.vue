<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12 is-vertical">
        <article class="tile is-child box">
          <h1 class="title">

            <!-- <button type="button" class="button is-primary" @click.prevent="refresh" :disabled="loading">Refresh</button> -->
            <!-- <input type="text" class="content" v-model="filter" placeholder="filter users"> -->

            <!-- <div class="level-item">
              <div class="field">
                Users
              </div>
              <div class="field">
                <button type="button" class="button is-primary" @click.prevent="refresh" :disabled="loading">Refresh</button>
              </div>
              <div class="field">
                <input class="input" type="text" placeholder="filter users">
              </div>
            </div> -->


            <!-- Main container -->
            <nav class="level">
              <!-- Left side -->
              <div class="level-left">
                <div class="level-item">
                  <p>Users</p>
                </div>
                <div class="level-item">
                  <p class="subtitle is-5">
                    <button type="button" class="button is-primary" @click.prevent="refresh" :disabled="loading">Refresh</button>
                  </p>
                </div>
                <div class="level-item">
                  <div class="field has-addons">
                    <p class="control">
                      <input class="input" type="text" v-model="filter" placeholder="Filter">
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </h1>
          <div v-if="loading.admin.users">
            Loading...
          </div>
          <div v-else class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Administrator</th>
                  <!-- <th>Provisioned For</th> -->
                  <!-- <th>Last Login</th> -->
                  <!-- <th>Last Failed Login</th> -->
                  <th>CWCC Demo Configuration</th>
                  <th>Actions</th>
                  <!-- <th class="is-hidden-mobile">Internal DNIS</th> -->
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in sortedFilteredUsers">
                  <td>{{ user.firstName + ' ' + user.lastName }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.id }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.admin ? 'Administrator' : '' }}</td>
                  <!-- <td>
                    <user-row inline-template
                    :user="user"
                    :instance="instance"
                    :provision="userProvisionMap">
                    <ul>
                      <li v-for="p of myProvision">
                        <strong v-if="p.instance === instance">
                          {{ p.instance }}
                        </strong>
                        <span v-else>
                          {{ p.instance }}
                        </span>
                      </li>
                    </ul></user-row>
                  </td> -->
                  <!-- <td>{{ user.lastLogin | moment("from") }}</td> -->
                  <!-- <td>{{ user.lastFailedLogin  | moment("from") }}</td> -->
                  <td>
                    <span v-if="user.demo && user.demo.cwcc">
                      <!-- <input placeholder="vertical" v-model="user.demo.cwcc.vertical" /> -->
                      <input placeholder="tenantId" v-model="user.demo.cwcc.tenantId" />
                      <input placeholder="reasonId" v-model="user.demo.cwcc.reasonId" />
                      <button class="button is-success" @click.prevent="clickUpdateConfig(user)">
                        Save CWCC Demo Config
                      </button>
                    </span>
                    <span v-else>
                      Not Configured
                      <button class="button is-primary" @click.prevent="clickConfigure(user)">Configure</button>
                    </span>
                  </td>
                  <td><button type="button" class="button is-primary" @click.prevent="clickSu(user)">Switch User</button></td>
                </tr>
              </tbody>
            </table>

          </div>

        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { contains } from '../../filters'
import Vue from 'vue'

const UserRow = Vue.component('UserRow', {
  props: ['user', 'provision', 'instance'],
  computed: {
    // get list of CWCC v1 instances user is provisioned for
    // TODO put version and demo type in state
    myProvision () {
      return this.provision.filter(v => {
        return v.username === this.user.username &&
        v.version === 'v1' &&
        v.demo === 'cwcc'
      })
    }
  }
})

export default {
  data () {
    return {
      filter: '',
      model: []
    }
  },
  components: {
    UserRow
  },
  mounted () {
    // load users if they're not loaded yet
    if (!this.users.length) {
      return this.refresh(false)
    }
  },
  methods: {
    ...mapActions([
      'loadUsers',
      'su',
      'loadUserProvisionMap',
      'updateUser'
    ]),
    refresh (showNotification) {
      this.loadUsers(showNotification)
      this.loadUserProvisionMap(showNotification)
    },
    clickSu (user) {
      this.su({
        showNotification: true,
        user
      })
    },
    clickUpdateConfig (user) {
      console.log('clickUpdateConfig - updating user', user)
      // update target user with their new cwcc data in the form
      this.updateUser({
        user,
        body: user.demo.cwcc
      })
    },
    clickConfigure (user) {
      console.log('clickConfigure', user)
      if (!user.demo) {
        Vue.set(user, 'demo', {})
      }
      if (!user.demo.cwcc) {
        Vue.set(user.demo, 'cwcc', {})
      }
      if (!user.demo.cwcc.vertical) {
        Vue.set(user.demo.cwcc, 'vertical', '')
      }
      if (!user.demo.cwcc.tenantId) {
        Vue.set(user.demo.cwcc, 'tenantId', '')
      }
      if (!user.demo.cwcc.reasonId) {
        Vue.set(user.demo.cwcc, 'reasonId', '')
      }
      console.log('user is now configured for cwcc:', user)
    }
  },
  computed: {
    ...mapGetters([
      'users',
      'userProvisionMap',
      'instance',
      'currentInstance',
      'loading'
    ]),
    sortedUsers () {
      return this.model
    },
    sortedFilteredUsers () {
      // filter data using the search box
      return this.sortedUsers.filter(contains(this.filter))
    }
  },
  watch: {
    users (val, oldVal) {
      // copy users to cache
      this.model = JSON.parse(JSON.stringify(this.users))
    }
  }
}
</script>
