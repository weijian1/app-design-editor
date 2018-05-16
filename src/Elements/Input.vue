<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type">
      <template v-if="value.input.property && value.input.property.inputable_type == 'text'">
          <input class="content-inner" 
                 type="text"
                 :required="value.input.property.base_property.required"
                 :placeholder="value.input.property.base_property.placeholder"
                 :style="inputCss">
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
                color: this.value.base_css.color,
                paddingTop: this.value.base_css.paddingTop,
                paddingLeft: this.value.base_css.paddingLeft,
                paddingBottom: this.value.base_css.paddingBottom,
                paddingRight: this.value.base_css.paddingRight,
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
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: none;
}
</style>
