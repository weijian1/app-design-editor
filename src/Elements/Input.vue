<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type">
      <template v-if="value.input.property && value.input.property.inputable_type == 'inputText'">
          <input class="content-inner input-text" 
                 type="text"
                 :required="value.input.property.required"
                 :placeholder="value.input.property.displayPlaceholder"
                 :style="inputCss">
      </template>
      <template v-else-if="value.input.property && value.input.property.inputable_type == 'inputRegion'">
          <div class="content-inner input-region">
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>省</span>
              </span>
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>市</span>
              </span>
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>区</span>
              </span>
          </div>
      </template>
      <template v-else-if="value.input.property && value.input.property.inputable_type == 'inputDate'">
          <div class="content-inner input-region">
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>年</span>
              </span>
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>月</span>
              </span>
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>日</span>
              </span>
          </div>
      </template>
      <template v-else-if="value.input.property && value.input.property.inputable_type == 'inputTime'">
          <div class="content-inner input-region">
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>时</span>
              </span>
              <span class="region-inner">
                  <div :style="placehoderCss | obj2CSS">{{ value.input.property.displayPlaceholder }}</div>
                  <span>分</span>
              </span>
          </div>
      </template>
      <template v-else-if="value.input.property && value.input.property.inputable_type == 'inputSelect'">
          <div class="content-inner input-select">
              <span class="select-text">{{ value.input.property.inputable.property.items[currentIndex].title }}</span>
              <div class="triangle-facing-right" :style="{ borderColor: value.input.property.inputable.property.arrowColor } | obj2CSS"></div>  
          </div>
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
        },
        placehoderCss: function() {
            return {
                color: this.value.input.property.placeholderColor
            };
        },
        currentIndex: function() {
            if (this.value.input.property.inputable_type == 'inputSelect') {
                return this.value.input.property.inputable.property.currentIndex;
            }
            return null;
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

.content-inner.input-region {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    overflow: hidden;
    .region-inner {
        flex-grow: 1;
        flex-basis: 0%;
        display: flex;
        flex-flow: row nowrap;
        border-right: solid 1px #ededed;
        padding-left: 2px;
        padding-right: 2px;
        min-width: 0;
        &:last-child {
            border-right: none;
            padding-right: 0;
        }
        div {
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;
        }
    }
}

.content-inner.input-select {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    .select-text {
        display: block;
        margin-right: 5px;
    }
}

.triangle-facing-right {  
    display: inline-block;  
    border-right: 1px solid; border-bottom: 1px solid;  
    width: 8px; height: 8px;  
    transform: rotate(-45deg);  
}  

</style>
