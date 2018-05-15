<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type">
      <template v-if="value.button.property">
          <button class="content-inner" 
                 type="submit"
                 :style="inputCss">{{ value.button.property.title }}</button>
      </template>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            
        }
    },
    components: {
        ElementBorder
    },
    props: {
        value: {
            
        }
    },
    watch: {

    },
    methods: {
        
    },
    computed: {
        inputCss: function() {
            return {
                fontSize: this.value.base_css.fontSize,
                fontWeight: this.value.base_css.fontWeight,
                fontStyle: this.value.base_css.fontStyle,
                textDecoration: this.value.base_css.textDecoration,
                textAlign: this.value.base_css.textAlign,
                color: this.value.base_css.color
            };
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>


<style lang="scss" scoped>
.content-inner {
    -webkit-appearance: none;
    border: none;
    background: transparent;
}
</style>
