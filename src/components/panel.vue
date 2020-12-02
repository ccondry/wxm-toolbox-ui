<template>
  <b-collapse
  :aria-id="ariaId"
  class="panel"
  animation="slide"
  >
    <div
    v-if="title.length"
    slot="trigger"
    slot-scope="props"
    class="panel-heading"
    role="button"
    :aria-controls="ariaId"
    >
      <strong>
        {{ title }}
      </strong>
      <span
      style="float: right;"
      >
        <b-icon type="is-primary" :icon="props.open ? 'menu-down' : 'menu-up'" />
      </span>
    </div>
    <!-- <div
    v-if="title.length"
    slot="trigger"
    slot-scope="props"
    class="card-header panel-heading"
    role="button"
    >
      <p class="card-header-title">
          {{ title }}
      </p>
      <a class="card-header-icon">
        <b-icon
            :icon="props.open ? 'menu-down' : 'menu-up'">
        </b-icon>
      </a>
    </div> -->
  
    <div
    class="panel-block"
    style="background-color: white;"
    :style="!title.length ? 'border-radius: 6px;' : ''"
    >
      <div class="content" style="position: relative;">
        <slot /> 
      </div>
    </div>
  </b-collapse>
</template>

<script>
export default {
  props: {
    title: {
      default: '',
      type: String
    },
    ariaId: {
      default: '',
      type: String
    }
  }
}
</script>