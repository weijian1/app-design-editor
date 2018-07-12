<template>
    <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners" v-cloak v-show="isLoadFinish">
        <div class="content-inner" v-if="value.multi_layer_product.property">
            <div class="scenePic" :style="`backgroundImage: url(${value.multi_layer_product.property.scenePic})`"></div>
            <div v-for="(item, index) in value.multi_layer_product.property.layers" 
                 :key="index"
                 :class="`layer${item.level}`"
                 :style="`backgroundImage: url(${item.item_pics[item.currentIndex] ? item.item_pics[item.currentIndex].url : ''})`"></div>
            <div class="toolbar"  :style=" { backgroundColor: `rgba(0, 0, 0, ${1 - value.multi_layer_product.property.opacity})` }">
                <div class="toolbar-class">
                    <span v-for="(layer,index) in layers" :key="index" 
                          :class="value.multi_layer_product.property.currentIndex == index ? 'selected' : ''">{{layer.title}}</span>
                </div>
                <div class="toolbar-item">
                    <div v-for="(pic, index) in layers[value.multi_layer_product.property.currentIndex].item_pics" 
                         :key="index" :style="{ width: value.multi_layer_product.property.imageWidth + 'px', 
                                                height: value.multi_layer_product.property.imageHeight + 'px',
                                                backgroundImage: `url(${pic.url})` }"></div>
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
                background: rgba(0, 0, 0, .7);
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
            div {
                background-repeat: no-repeat;
                background-size: contain;
            }
            div:first-child {
                margin-left: 14px;
            }
            div {
                margin-right: 14px;
            }
        }
    }
</style>

