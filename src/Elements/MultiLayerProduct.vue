<template>
    <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners" v-cloak v-show="isLoadFinish">
        <div class="content-inner" v-if="value.multi_layer_product.property">
            <div class="scenePic" :style="{ backgroundImage: value.multi_layer_product.property.scenePic } | Obj2CSS"></div>
            <div v-for="(item, index) in value.multi_layer_product.property.layers" 
                 :key="index"
                 :class="`layer${item.level}`"
                 :style="{ backgroundImage: item.item_pics[item.currentIndex] ? item.item_pics[item.currentIndex].url : '' }"></div>
            <div class="toolbar"  :style=" { backgroundColor: `rgba(0, 0, 0, ${1 - value.multi_layer_product.property.opacity})` }">
                <div class="toolbar-class">
                    <span v-for="(layer,index) in layers" :key="index" 
                          :class="value.multi_layer_product.property.currentIndex == index ? 'selected' : ''">{{layer.title}}</span>
                </div>
                <div class="toolbar-item">
                    <div class="toolbar-item-wrapper" ref="itemList" :style="contentInnerCss | Obj2CSS">
                        <div class="item-wrapper" :class="value.multi_layer_product.property.layers[value.multi_layer_product.property.currentIndex].currentIndex == index ? 'selected' : ''" 
                                                v-for="(pic, index) in layers[value.multi_layer_product.property.currentIndex].item_pics" :key="index">
                            <div :style="{ width: value.multi_layer_product.property.imageWidth, 
                                        height: value.multi_layer_product.property.imageHeight,
                                        backgroundImage: pic.url,
                                        borderRadius: value.base_css.borderRadius} | Obj2CSS"
                                class="item-img"></div>
                                <div class='item-title' :style="{ width: value.multi_layer_product.property.imageWidth } | Obj2CSS">{{pic.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </element-border>
</template>

<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'

export default {
    mixins: [ MixinElement ],
    components: {
        ElementBorder
    },
    props: {
        value: {
            
        }
    },
    data() {
        return {
            borderListeners: {
                move: true,
                rotate: true,
                resize: false,
                resizeDirection: []
            },
            contentInnerCss: {
                left: 0
            }
        }
    },
    methods: {
        moveViewFromItemIndex(classIndex, itemPicIndex) {
            console.log(classIndex);
            console.log(itemPicIndex);
            let item = this.$refs.itemList.children[itemPicIndex];
            let elementContent = this.$refs.itemList.parentElement;

            let itemRect = item.getBoundingClientRect();
            let elementContentRect = elementContent.getBoundingClientRect();

            let elementContentLeftWidth = elementContentRect.left + elementContentRect.width;
            let itemLeftWidth = itemRect.left + itemRect.width;

            let currentLeft = this.contentInnerCss.left;

            // // 判断右边是否超出
            if (elementContentLeftWidth <= itemLeftWidth) {
                let offsetWidth = itemRect.left - elementContentLeftWidth + itemRect.width;
                this.contentInnerCss = {
                    left: -offsetWidth + currentLeft
                };
            }

            // // 判断左边是否超出
            if (elementContentRect.left >= itemRect.left) {
                let offsetWidth = elementContentRect.left - itemRect.left;
                this.contentInnerCss = {
                    left: offsetWidth + currentLeft
                };
            }

        }
    },
    computed: {
        layers() {
            return this.value.multi_layer_product.property.layers;
        }
    },
    mounted() {
        this.$watch('value.multi_layer_product.property.currentIndex', (newVal, oldVal) => {
            let layerCurrentIndex = this.value.multi_layer_product.property.layers[newVal].currentIndex;
            this.moveViewFromItemIndex(newVal, layerCurrentIndex);
        });
        this.$watch('value.multi_layer_product.property.layers', (newVal, oldVal) => {
            let classCurrentIndex = this.value.multi_layer_product.property.currentIndex;
            this.moveViewFromItemIndex(classCurrentIndex, this.value.multi_layer_product.property.layers[classCurrentIndex].currentIndex);
        }, {
            deep: true,
            immediate: true
        });
        
        this.$nextTick(() => {
            setTimeout(() => {
                let classCurrentIndex = this.value.multi_layer_product.property.currentIndex;
                this.moveViewFromItemIndex(classCurrentIndex, this.value.multi_layer_product.property.layers[classCurrentIndex].currentIndex);
            }, 50);
        });
    },
    filters: {
        Obj2CSS
    }
}
</script>

<style lang="scss" scope>
    .content-inner {
        .scenePic, .layer1, .layer2 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-color: white;
        }
        .toolbar {
            position: absolute;
            top: auto;
            bottom: 0;
            width: 100%;
            padding-bottom: 14px;
        }
        .toolbar-class {
            margin-bottom: 18px;
            span {
                display: inline-block;
                padding:  7px 14px;
                background: rgba(0, 0, 0, .3);
                color: white;
                font-size: 12px;
            }
            span.selected {
                background: black;
                color: white;
            }
        }
        .toolbar-item {
            position: relative;
            overflow: hidden;
        }
        .toolbar-item-wrapper {
            position: relative;
            display: flex;
            width: 100%;
        }
        .toolbar-item .item-wrapper {
            margin-right: 14px;
        }
        .toolbar-item .item-wrapper:first-child {
            margin-left: 14px;
        }
        .toolbar-item .item-img {
            background-clip: content-box;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            padding: 3px;
        }
        .toolbar-item .item-wrapper.selected .item-img {
            border: solid 1px white;
        }
        .toolbar-item .item-title {
            text-align: center;
            font-size: 12px;
            color: white;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
        }
    }
</style>

