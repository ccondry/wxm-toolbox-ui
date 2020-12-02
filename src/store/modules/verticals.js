const state = {
  verticals: {
    bank: {
      name: 'Bank'
    },
    heal: {
      name: 'Healthcare'
    },
    product: {
      name: 'Products'
    },
    retail: {
      name: 'Retail'
    }
  }
}

const getters = {
  verticals: state => state.verticals
}

export default {
  state,
  getters
}
