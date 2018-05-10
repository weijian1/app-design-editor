<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.element_type">
    <div class="content-inner" v-if="value.imagelist.property" ref="itemList" :style="contentInnerCss | Obj2CSS">
        <div class="imagelist-item" v-for="(item,index) in value.imagelist.property.items" 
            :key="index" :style="{
                width: value.imagelist.property.imageBaseSetting.width
            } | Obj2CSS">
            <div class="image" :style="{
                width: value.imagelist.property.imageBaseSetting.width,
                height: value.imagelist.property.imageBaseSetting.height,
                backgroundImage: item.url,
            } | Obj2CSS"></div>
            <div class="text-wrapper" :style="{
                lineHeight: value.base_css.lineHeight
            } | Obj2CSS">
                <div class="title" v-if="value.imagelist.property.isShowTitle == 1" :style="{
                    fontFamily: item.titleSetting.fontFamily,
                    fontSize: item.titleSetting.fontSize,
                    color: item.titleSetting.color,
                    height: value.imagelist.property.titleBaseSetting.height
                } | Obj2CSS">
                {{ item.title }}
                </div>
                <div class="subtitle" v-if="value.imagelist.property.isShowSubTitle == 1" :style="{
                    fontFamily: item.subTitleSetting.fontFamily,
                    fontSize: item.subTitleSetting.fontSize,
                    color: item.subTitleSetting.color,
                    height: value.imagelist.property.subTitleBaseSetting.height
                } | Obj2CSS">
                    {{ item.subTitle }}
                </div>
                <div class="introduce" v-if="value.imagelist.property.isShowIntroduce == 1" :style="{
                    fontFamily: item.introduceSetting.fontFamily,
                    fontSize: item.introduceSetting.fontSize,
                    color: item.introduceSetting.color,
                    height: value.imagelist.property.introduceBaseSetting.height
                } | Obj2CSS">
                    {{ item.introduce }}
                </div>
            </div>
        </div>
    </div>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementBorderResizeWidth.vue'
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
            let itemLeftWidth = itemRect.left + itemRect.width;

            let currentLeft = this.contentInnerCss.left;

            // 判断右边是否超出
            if (elementContentLeftWidth <= itemLeftWidth) {
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
        },
        calcCurrentHeight() {
            let property = this.value.imagelist.property;
            let totalHeight = property.imageBaseSetting.height;
            totalHeight += property.isShowTitle ? property.titleBaseSetting.height : 0;
            totalHeight += property.isShowSubTitle ? property.subTitleBaseSetting.height : 0;
            totalHeight += property.isShowIntroduce ? property.introduceBaseSetting.height : 0;
            
            this.value.base_css.height = totalHeight;
        }
    },
    computed: {

    },
    filters: {
        Obj2CSS
    },
    mounted() {
        this.moveViewFromItemIndex(this.value.imagelist.property.currentIndex);
        this.$watch('value.imagelist.property.currentIndex', (newVal, oldVal) => {
            this.moveViewFromItemIndex(newVal);
        });

        let invokeWatch = (newVal, oldVal) => {
            this.calcCurrentHeight();
        };
        this.calcCurrentHeight();

        // 当高度改变和设置开关的时候重新计算高度
        this.$watch('value.imagelist.property.imageBaseSetting.height', invokeWatch);
        this.$watch('value.imagelist.property.titleBaseSetting.height', invokeWatch);
        this.$watch('value.imagelist.property.subTitleBaseSetting.height', invokeWatch);
        this.$watch('value.imagelist.property.introduceBaseSetting.height', invokeWatch);

        this.$watch('value.imagelist.property.isShowTitle', invokeWatch);
        this.$watch('value.imagelist.property.isShowSubTitle', invokeWatch);
        this.$watch('value.imagelist.property.isShowIntroduce', invokeWatch);
    }
}
</script>


<style lang="scss" scoped>
.element-content {
    clear: both;
}
.content-inner {
    display: flex;
    width: auto!important;
    float: left;
    position: relative;
    .imagelist-item {
        margin-right: 10px;
        .image {
            background-size: cover;
            background-position: center;
        }
    }
    
}
</style>
