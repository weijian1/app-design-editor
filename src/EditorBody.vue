<template>
  <div class="editor-body" :style="propertyCss | Obj2CSS" @click="unselectElemnt" tabindex="-1" @keydown="handleKeyDown" @keyup="handleKeyUp" v-cloak>
      <template v-for="(element, index) in value.elements">
        <component :is="`element-${element.elementable_type}`" v-model="value.elements[index]" :ref="`component_${index}`" :index="index" :key="index"></component>
      </template>
  </div>
</template>

<script>
import ElementText from './Elements/Text.vue'
import ElementImg from './Elements/Img.vue'
import ElementSvg from './Elements/Svg.vue'
import ElementVideo from './Elements/Video.vue'
import ElementMap from './Elements/Map.vue'
import ElementSlider from './Elements/Slider.vue'
import ElementClassify from './Elements/Classify.vue'
import ElementImagelist from './Elements/Imagelist.vue'
import ElementTabbar from './Elements/Tabbar.vue'
import ElementInput from './Elements/Input.vue'
import ElementButton from './Elements/Button.vue'
import ElementMultiLayerProduct from './Elements/MultiLayerProduct.vue'
import EditorMinxin  from './Mixins/Editor'
import Obj2CSS from './Filters/Obj2CSS'
import keyCodeUtil from './Utils/KeyCode'
import PlatformUtil from './Utils/Platform'
import Vue from 'vue'

export default {
    mixins: [ EditorMinxin ],
    components: {
        ElementText,
        ElementImg,
        ElementSvg,
        ElementVideo,
        ElementMap,
        ElementSlider,
        ElementClassify,
        ElementImagelist,
        ElementTabbar,
        ElementInput,
        ElementButton,
        ElementMultiLayerProduct
    },
    data() {
        return {
            selectElementIndex: null,
        };
    },
    props: {
        value: {
            required: true
        },
        editorStyle: {
            required: true
        }
    },
    methods: {
        unselectElemnt(e) {
            if (e.target == this.$el) {
                this.editorParent.onElementUnselect();
            }
        },
        handleKeyDown(e) {
            let elementIndex = this.editorParent.$data.editorData.select.elementIndex;
            for (let i = 0; i < elementIndex.length; i++) {
                let elementComponent =  this.$refs[`component_${elementIndex[i]}`][0].$children[0];

                if (elementComponent.elementType == 'text' && elementComponent.textIsEditing == true) {
                    return true;
                }
            }

            for (let key in keyCodeUtil) {
                if (keyCodeUtil[key] == keyCodeUtil.KEYCODE_BACKSPACE) {
                    if (PlatformUtil.getPlatform() == PlatformUtil.OSX) {
                        e.preventDefault();
                    }
                } else if (keyCodeUtil[key] == e.keyCode) {
                    e.preventDefault();
                }
            }

            if ((PlatformUtil.getPlatform() != PlatformUtil.OSX && e.keyCode == keyCodeUtil.KEYCODE_DELETE) || 
                (PlatformUtil.getPlatform() == PlatformUtil.OSX && e.keyCode == keyCodeUtil.KEYCODE_BACKSPACE)) {
                if (elementIndex.length == 1) {
                    let ret = this.editorParent.onDeleteElement();
                    if (ret.cancelable == false) {
                        this.editorParent.deleteElement(elementIndex);
                    }
                }
            } else if (e.keyCode == keyCodeUtil.KEYCODE_ESC) {
                this.editorParent.onElementUnselect();
            } else if (e.keyCode >= 37 && e.keyCode <= 40) {
                this.processMoveItem(e.keyCode);
            }

            if ((PlatformUtil.getPlatform() != PlatformUtil.OSX && 
                 e.ctrlKey == true && 
                 e.keyCode == keyCodeUtil.KEYCODE_C) || 
                 (PlatformUtil.getPlatform() == PlatformUtil.OSX && 
                 e.metaKey == true && 
                 e.keyCode == keyCodeUtil.KEYCODE_C)) {
                // 按下了ctrl + c
                if (elementIndex.length > 0) {
                    let ret = this.editorParent.onCopyElement();
                    if (ret.cancelable == false) {
                        this.editorParent.copyElement();
                    }
                }
            } else if ((PlatformUtil.getPlatform() != PlatformUtil.OSX && 
                 e.ctrlKey == true && 
                 e.keyCode == keyCodeUtil.KEYCODE_V) || 
                 (PlatformUtil.getPlatform() == PlatformUtil.OSX && 
                 e.metaKey == true && 
                 e.keyCode == keyCodeUtil.KEYCODE_V)) {
                // 按下了Ctrl + v
                if (this.editorParent.$data.editorData.clipboardElement.length > 0) {
                    let ret = this.editorParent.onPasteElement();
                    if (ret.cancelable == false) {
                        this.editorParent.pasteElement(ret.pasteElement);
                    }
                }
            } else if ((PlatformUtil.getPlatform() != PlatformUtil.OSX && 
                 e.ctrlKey == true) || 
                 (PlatformUtil.getPlatform() == PlatformUtil.OSX && 
                 e.metaKey == true) || e.shiftKey == true) {
                     this.editorParent.$data.editorData.currentAction.multiSelect = true;
            }
        },
        handleKeyUp(e) {
            this.editorParent.$data.editorData.currentAction.multiSelect = false;
        },
        processMoveItem(direction) {
            let elementIndex = this.editorParent.$data.editorData.select.elementIndex;
            let elementComponent =  this.$refs[`component_${elementIndex[0]}`][0].$children[0];
            let e = {
                preventDefault() {

                },
                srcEvent: {
                    stopPropagation() {

                    }
                }
            };

            if (direction == keyCodeUtil.KEYCODE_UP) {
                e.deltaX = 0;
                e.deltaY = -1;
            } else if (direction == keyCodeUtil.KEYCODE_DOWN) {
                e.deltaX = 0;
                e.deltaY = 1;
            } else if (direction == keyCodeUtil.KEYCODE_LEFT) {
                e.deltaX = -1;
                e.deltaY = 0;
            }  else if (direction == keyCodeUtil.KEYCODE_RIGHT) {
                e.deltaX = 1;
                e.deltaY = 0;
            }

            elementComponent.startMove(e);
            elementComponent.moving(e);
            elementComponent.endMove(e);
        }
    },
    watch: {
    },
    computed: {
        pageSize() {
            let pageSize = {
                width: this.editorStyle.width
            };
            let minHeight = this.editorStyle.height - this.editorStyle.navbar.height;
            if (this.value.property.height < minHeight) {
                pageSize.height = minHeight;
            }
            pageSize.height = this.value.property.height;

            return pageSize;
        },
        propertyCss() {
            let pageProperty = this.value.property;
            let cssProperty = {};
            let minHeight = this.editorStyle.height - this.editorStyle.navbar.height;
            if (pageProperty.height < minHeight) {
                cssProperty.height = minHeight;
            }
            cssProperty.height = pageProperty.height;

            if (pageProperty.type == 1) {
                cssProperty.backgroundColor = pageProperty.backgroundColor;
            } else if (pageProperty.type == 2) {
                cssProperty.backgroundImage = pageProperty.backgroundImage;
                cssProperty.backgroundRepeat = 'no-repeat';
                cssProperty.backgroundSize = 'cover';
            }

            return cssProperty;
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>

<style lang="scss" scoped>
    .editor-body {
        width: 100%;
        height: 603px;
        position: relative;
        background-color: white;
        box-shadow: -1px 1px 0 #f2f2f2, 1px 1px 0 #f2f2f2;

        &:focus {
            outline: 0;
        }
    }
</style>
