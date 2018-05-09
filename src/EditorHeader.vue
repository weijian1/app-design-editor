<template>
  <div class="editor-header" @click="clickNavBar">
      <NavBar :title="value.navigationBarTitle" 
              :bgColor="value.navigationBarBackgroundColor"
              :textColor="value.navigationBarTextStyle"
              :height="navbar.height"></NavBar>
  </div>
</template>

<script>
import NavBar from './Elements/NavBar.vue'
import EditorMixin from './Mixins/Editor'
export default {
  components: {
      NavBar
  },
  mixins: [ EditorMixin ],
  props: {
      value: {
          required: true
      },
      navbar: {
          required: true,
      }
  },
  methods: {
      clickNavBar() {
          this.editorParent.onEditorHeaderSelect();
      }
  }
}
</script>

<style lang="scss" scoped>
    .editor-header {
        text-align: center;
    }
</style>
