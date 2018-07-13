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

        }
    },
    methods: {

    },
    computed: {
        layers() {
            return this.value.multi_layer_product.property.layers;
        }
    },
    mounted() {
        
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
            display: flex;
            overflow: hidden;
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

