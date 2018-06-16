<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners" v-cloak v-show="isLoadFinish">
      <template v-if="value.slider.property">
        <div class="content-inner">
            <img v-if="currentItem != null" :style="imgCss | Obj2CSS" :src="currentItem.url" width="100%" height="100%" />
        </div>
        <div class="indicator-wrapper" v-if="value.slider.property.hasIndicator == 1">
            <span v-for="(item,index) in value.slider.property.items" 
                  :key="index"
                  :style="index == value.slider.property.currentIndex ? 
                          {background: value.slider.property.indicatorActiveColor} : 
                          {background: value.slider.property.indicatorColor}"
                 class="indicator"></span>
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
            borderListeners: {
                move: true,
                rotate: true,
                resize: true,
                resizeEqualProportion: true,
                resizeDirection: []
            }
        }
    },
    components: {
        ElementBorder
    },
    props: {
        value: {
            borderListeners: {
                move: true,
                rotate: true,
                resize: true,
                resizeEqualProportion: true,
                resizeDirection: []
            }
        }
    },
    watch: {

    },
    methods: {
        
    },
    computed: {
        currentItem: function() {
            if (this.value.slider.property) {
                let totalLength = this.value.slider.property.items.length;
                let currentIndex = this.value.slider.property.currentIndex;
                if (currentIndex > totalLength - 1) {
                    return  this.value.slider.property.items[0];
                }

                return this.value.slider.property.items[currentIndex];
            }

            return null;
        },
        imgCss: function() {
            return {
                borderRadius: this.value.base_css.borderRadius
            };
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>


<style lang="scss" scoped>
    .element-content {
        .content-inner {
            pointer-events: none;
        }
        .indicator-wrapper {
            position: absolute;
            width: 100%;
            top: auto;
            bottom: 10px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            .indicator {
                width: 6px;
                height: 6px;
                border-radius: 6px;
                margin-right: 4px;
            }
        }
    }
</style>
