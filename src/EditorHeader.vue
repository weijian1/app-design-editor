<template>
  <div class="editor-header">
      <NavBar :title="value.navigationBarTitle" 
              :bgColor="value.navigationBarBackgroundColor"
              :textColor="value.navigationBarTextStyle"
              :height="navbar.height"></NavBar>
  </div>
</template>

<script>
import NavBar from './Elements/NavBar.vue'
export default {
  components: {
      NavBar
  },
  props: {
      value: {
          required: true
      },
      navbar: {
          required: true,
      }
  }
}
</script>

<style lang="scss" scoped>
    .editor-header {
        text-align: center;
    }
</style>
