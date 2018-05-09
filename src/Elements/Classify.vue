<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.element_type">
      <div class="content-inner" v-if="value.classify.property" ref="itemList" :style="contentInnerCss | Obj2CSS">
          <div class="classify-item" v-for="(item,index) in value.classify.property.items" 
                :key="index"
                :class="`item-count-${countClass}`">
                <span :style="{
                            color: item.activeColor,
                            textDecoration: value.base_css.textDecoration,
                            borderBottomStyle: 'solid',
                            borderBottomWidth: item.borderColor ? '1px' : 0,
                            borderBottomColor: item.borderColor
                        }">
                {{ item.title }}
                </span>
            </div>
      </div>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementNotResizeBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            contentInnerCss: {
                left: 0
            }
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
        moveViewFromItemIndex(newItemIndex) {
            if (newItemIndex > this.$refs.itemList.children.length - 1) {
                return false;
            }

            let item = this.$refs.itemList.children[newItemIndex];
            let elementContent = this.$refs.itemList.parentElement;

            let itemRect = item.getBoundingClientRect();
            let elementContentRect = elementContent.getBoundingClientRect();
            let elementContentLeftWidth = elementContentRect.left + elementContentRect.width;

            let currentLeft = this.contentInnerCss.left;
            // console.log(currentLeft);

            // 判断右边是否超出
            if (elementContentLeftWidth <= itemRect.left) {
                let offsetWidth = itemRect.left - elementContentLeftWidth + itemRect.width;
                this.contentInnerCss = {
                    left: -offsetWidth + currentLeft
                };
            }

            // 判断左边是否超出
            if (elementContentRect.left >= itemRect.left) {
                let offsetWidth = elementContentRect.left - itemRect.left;
                this.contentInnerCss = {
                    left: offsetWidth + currentLeft
                };
            }
        }
    },
    computed: {
        countClass: function() {
            let count = this.value.classify.property.items.length;
            return count > 5 ? 'more' : count;
        },
        currentItem: function() {
            if (this.value.classify.property) {
                let totalLength = this.value.classify.property.items.length;
                let currentIndex = this.value.classify.property.currentIndex;
                if (currentIndex > totalLength - 1) {
                    return  this.value.classify.property.items[0];
                }

                return this.value.classify.property.items[currentIndex];
            }

            return null;
        }
    },
    filters: {
        Obj2CSS
    },
    mounted() {
        this.moveViewFromItemIndex(this.value.classify.property.currentIndex);
        this.$watch('value.classify.property.currentIndex', (newVal, oldVal) => {
            this.moveViewFromItemIndex(newVal);
        });
    }
}
</script>


<style lang="scss" scoped>
.element-content {
    clear: both;
}
.content-inner {
    position: relative;
    width: auto!important;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    float: left;
    background: white;
    .classify-item {
        display: block;
        flex-grow: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 75px;
        padding-bottom: 4px;
        span {
            padding-bottom: 4px;
        }
    }

    .item-count-1 {
        width: 100%;
    }
    .item-count-2 {
        width: 50%;
    }
    .item-count-3 {
        width: 33.33%;
    }
    .item-count-4 {
        width: 25%;
    }
    .item-count-5 {
        width: 20%;
    }
    .item-count-more {
        width: 75px;
    }
}
</style>
