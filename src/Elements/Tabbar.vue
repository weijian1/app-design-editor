<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners">
      <div class="content-inner" v-if="value.tabbar.property">
          <div class="tabbar-item" v-for="(item, index) in value.tabbar.property.items" :key="index"
               :style="{
                   backgroundColor: item.backgroundColor,
                   alignItems: item.titleTextAlign == 'left' ? 'flex-start' : item.titleTextAlign == 'right' ? 'flex-end' : 'center',
                   color: item.titleColor,
                   fontSize: item.titleFontSize,
                   fontStyle: item.titleFontStyle,
                   fontWeight: item.titleFontWeight,
                   textDecoration: item.titleTextDecoration
               } | Obj2CSS">
              <span :class="`tabbar-item-icon tabbar-type-${value.tabbar.property.type}`"
                    v-if="value.tabbar.property.type == 2 || value.tabbar.property.type == 3"
                    :style="{backgroundImage: item.svgBase64} | Obj2CSS"></span>
              <span v-html="arrImgItemHtml[index]" :data-index="index" class="tabbar-item-svg"
                    v-if="value.tabbar.property.type == 2 || value.tabbar.property.type == 3"></span>
              <span :class="`tabbar-item-title tabbar-type-${value.tabbar.property.type}`"
                    v-if="value.tabbar.property.type == 1 || value.tabbar.property.type == 3">{{ item.title }}</span>
          </div>
      </div>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import Base64Util from './../Utils/Base64'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            borderListeners: {
                move: false,
                rotate: false,
                resize: false,
            },
            tabbarHeightUnWatchFun: null,
            arrImgItemHtml: []
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
    mounted() {
        // 重新计算tabbar位置
        this.calcTabbarPosition();
        let tabbarHeightUnWatchFun = this.$parent.$watch('value.property.height', (newVal, oldVal) => {
            this.calcTabbarPosition();
        });
        this.tabbarHeightUnWatchFun = tabbarHeightUnWatchFun;

        // 转换svg
        this.updateSvg();
        this.$watch('value.tabbar.property.items', (newVal, oldVal) => {
            this.updateSvg();
        }, {
            deep: true
        });
    },
    beforeDestroy() {
        this.tabbarHeightUnWatchFun();
    },
    methods: {
        calcTabbarPosition() {
            let pageHeight = this.editorParent.value.property.height;
            this.value.base_css.height = 49;
            this.value.base_css.top = pageHeight - this.value.base_css.height;
        },
        updateSvg() {
            this.arrImgItemHtml = [];
            for (let i = 0; i < this.value.tabbar.property.items.length; i++) {
                this.arrImgItemHtml.push(Base64Util.decode(this.value.tabbar.property.items[i].svgBase64));
            }

            this.$nextTick(() => {
                for (let i = 0; i < this.arrImgItemHtml.length; i++) {
                    let svgEl = this.$el.querySelector(`.content-inner .tabbar-item .tabbar-item-svg[data-index="${i}"] svg`);

                    if (svgEl != null) {
                        svgEl.style.fill = this.value.tabbar.property.items[i].fill;
                        this.value.tabbar.property.items[i].svgBase64 = 'data:image/svg+xml;base64,' + Base64Util.encode(svgEl.parentElement.innerHTML);
                    }
                }
            });
        }
    },
    computed: {

    },
    filters: {
        Obj2CSS
    }
}
</script>


<style lang="scss" scoped>
.content-inner {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    .tabbar-item {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        .tabbar-item-svg {
            display: none;
        }
        .tabbar-item-icon {
            display: block;
            width: 26px;
            height: 26px;
            margin: 0 auto;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }
}
</style>
