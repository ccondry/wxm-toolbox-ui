<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12 is-vertical">
        <article class="tile is-child box">
          <h1 class="title">
            <nav class="level">
              <!-- Left side -->
              <div class="level-left">
                <div class="level-item">
                  Virtual Teams
                </div>
                <div class="level-item">
                  <p class="subtitle is-5">
                    <button type="button" class="button is-primary" @click.prevent="refresh" :disabled="loading.cwcc.virtualTeam">Refresh</button>
                  </p>
                </div>
                <div class="level-item">
                  <div class="field has-addons">
                    <p class="control">
                      <b-input v-model="filter" placeholder="Filter" />
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </h1>
          <b-table :data="tData" :loading="loading.cwcc.virtualTeam" :narrowed="true" :paginated="true" :per-page="15">
            <template slot-scope="props">
              <b-table-column field="id" label="ID" sortable>
                {{ props.row.id }}
              </b-table-column>

              <b-table-column field="type" label="Type" sortable>
                {{ props.row.type }}
              </b-table-column>

              <b-table-column field="name" label="Name" sortable>
                {{ props.row.name }}
              </b-table-column>

              <b-table-column field="dbId" label="Database ID" sortable>
                {{ props.row.dbId }}
              </b-table-column>

              <b-table-column field="channel" label="Channel Type" sortable>
                {{ props.row.channel }}
              </b-table-column>

              <b-table-column field="status" label="Status" sortable>
                {{ props.row.status }}
              </b-table-column>

              <b-table-column field="actions" label="Actions">
                <button
                v-if="props.row.status === 'enabled'"
                type="button"
                class="button is-warning"
                @click.prevent="clickDisable(props.row)"
                :disabled="loading.cwcc.virtualTeam || working.cwcc.virtualTeam"
                >Disable</button>
                <button
                v-if="props.row.status === 'disabled'"
                type="button"
                class="button is-info"
                @click.prevent="clickEnable(props.row)"
                :disabled="loading.cwcc.virtualTeam || working.cwcc.virtualTeam"
                >Enable</button>
                <button
                type="button"
                class="button is-danger"
                @click.prevent="clickDelete(props.row)"
                :disabled="loading.cwcc.virtualTeam || working.cwcc.virtualTeam"
                >Delete</button>
              </b-table-column>
            </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>No virtual teams found?</p>
                </div>
              </section>
            </template>

            <template slot="footer">
              <div class="has-text-right">
                Total Virtual Teams: {{ tData.length }}
              </div>
            </template>
          </b-table>
        </article>
      </div>
    </div>
    <b-modal :active.sync="isComponentModalActive"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal>
    <create-instance-modal @submit="submitCreate"></create-instance-modal>
  </b-modal>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreateInstanceModal from '../../components/modals/create-instance.vue'
import FuzzySearch from 'fuzzy-search'

function duplicate (input) {
  return JSON.parse(JSON.stringify(input))
}

export default {
  components: {
    CreateInstanceModal
  },

  data () {
    return {
      filter: '',
      isComponentModalActive: false,
      tColumns: [
        {
          field: 'name',
          label: 'Name',
          width: '26'
          // numeric: true
        },
        {
          field: 'id',
          label: 'ID',
          numeric: true
        },
        {
          field: 'locked',
          label: 'Locked'
        },
        {
          field: 'action',
          label: 'Actions'
        }
      ]
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    ...mapActions([
      'getVirtualTeams',
      'disableVirtualTeam',
      'enableVirtualTeam',
      'deleteVirtualTeam'
    ]),
    submitCreate (body) {
      // clicked submit in the modal to create an instance
      console.log('submitCreate', body)
      this.createInstance({body})
    },
    clickDelete (team) {
      // clicked button to delete a virutal team
      console.log('clickDelete', team)
      const message = `Are you sure you want to DELETE <strong>${team.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Delete this team?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Yes',
        type: 'is-danger',
        onConfirm: () => {
          this.deleteVirtualTeam({team})
        }
      })
    },
    clickCreate () {
      // clicked button to start creating an instance
      console.log('clickCreate')
      this.isComponentModalActive = true
    },
    clickDisable (team) {
      console.log('clickDisable', team)
      const message = `Are you sure you want to DISABLE virtual team <strong>${team.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Disable this virtual team?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Yes',
        type: 'is-success',
        onConfirm: () => {
          this.disableVirtualTeam({team})
        }
      })
    },
    clickEnable (team) {
      console.log('clickEnable', team)
      const message = `Are you sure you want to ENABLE virtual team <strong>${team.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Enable this team?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Yes',
        type: 'is-success',
        onConfirm: () => {
          // this.$buefy.toast.open('User agreed')
          this.enableVirtualTeam({team})
        }
      })
    },
    refresh (showNotification = false) {
      this.getVirtualTeams(showNotification)
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'loading',
      'working',
      'virtualTeams'
    ]),
    tData () {
      if (!this.virtualTeams || !Array.isArray(this.virtualTeams)) {
        return []
      }

      const data = duplicate(this.virtualTeams)
      .map(v => {
        const channelTypes = {
          1: 'voice',
          2: '2',
          3: 'email',
          4: 'chat'
        }
        return {
          id: v.id,
          type: v.type,
          name: v.attributes.name__s,
          dbId: String(v.attributes.dbId__l),
          channel: channelTypes[v.attributes.channelType__i],
          status: v.attributes.status__i === 1 ? 'enabled' : 'disabled'
        }
      })
      // .filter(v => {
      //   const filter = this.filter.toLowerCase()
      //   return !filter.length ||
      //   v.id.toLowerCase() === filter ||
      //   String(v.dbId) === filter ||
      //   v.name.toLowerCase() === this.filter
      // })

      // filter children
      // const idResults = fuzzy.filter(this.filter, data)
      // map the original children objects
      // const matches = idResults.map(function (el) { return el.original })
      // replace children with fuzzy filtered results map
      // item.children = matches
      // return matches

      // Or: var FuzzySearch = require('fuzzy-search')

      const searcher = new FuzzySearch(data, ['id', 'name', 'dbId'], {
        caseSensitive: false,
      })

      const result = searcher.search(this.filter)
      // console.log('result', result)
      return result
    }
  }
}
</script>
