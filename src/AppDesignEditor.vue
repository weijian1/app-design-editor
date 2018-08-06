<template>
    <div class="design-editor" :class="{'loading': loading}" @click="onEditorClick" @contextmenu="handleContextMenu" v-cloak>
        <editor-wrapper v-model="value" :header="appHeader" :footer="appFooter"></editor-wrapper>
        <context-menu v-if="editorData.contextMenu.isShow" 
                      :isShow="editorData.contextMenu.isShow"
                      :showPosition="editorData.contextMenu.position"
                      :selectElementIndex="editorData.contextMenu.elementIndex"
                      @editelement="onEditorElementEdit"
                      @copyelement="onEditorElementCopy"
                      @pasteelement="onEditorElementPaste"
                      @deleteelement="onEditorElementDelete"
                      @movetop1layer="onEditorMoveTop1Layer"
                      @movebottom1layer="onEditorMoveBottom1Layer"
                      @movetop="onEditorMoveTop"
                      @movebottom="onEditorMoveBottom"></context-menu>
    </div>
</template>


<script>
import EditorWrapper from './EditorWrapper.vue'
import ContextMenu from './ContextMenu.vue'
import EditorMinxin  from './Mixins/Editor'
import EditorEvent from './Utils/EditorEvent'

export default {
    name: 'app-design-editor',
    components: {
        EditorWrapper,
        ContextMenu
    },
    mixins: [ EditorMinxin ],
    props: {
        value: {
            type: Object, 
            required: true
        },
        appHeader: {
            type: Object, 
            required: true
        },
        appFooter: {
            type: Object, 
            required: true
        },
        amapConfig: {
            type: Object, 
            default: {}
        },
        textEditorConfig: {
            type: Object, 
            default: {}
        }
    },
    data() {
        return {
            editorData: {
                clipboardElement: [],
                select: {
                    elementIndex: []
                },
                currentAction: {
                    resize: false,
                    rotate: false,
                    move: false,
                    multiSelect: false,
                },
                contextMenu: {
                    isShow: 0,
                    position: {
                        left: 0,
                        top: 0
                    },
                    elementIndex: []
                },
                layout: {
                    zIndex: 1
                }
            },
            loading: true,
            loadedItem: 0,
            totalLoadItem: 0
        }
    },
    created() {
        let processLoaded = () => {
            this.loadedItem++;
            if (this.loadedItem == this.totalLoadItem) {
                this.loading = false;
                this.$emit('editorready');
            }
        };
        let headEl = document.getElementsByTagName("head")[0];

        if (this.amapConfig && this.amapConfig.apiKey != '') {
            let scriptEl = document.createElement("script");
            scriptEl.id = 'amapsdk';
            scriptEl.src = window.location.protocol + `//webapi.amap.com/maps?v=1.4.6&key=${this.amapConfig.apiKey}&callback=onAmapSdkInit`;
            headEl.appendChild(scriptEl);
            this.totalLoadItem++;

            window.onAmapSdkInit = () => {
                processLoaded();
            }
        }

        let linkEl = document.createElement("link");
        linkEl.id = 'bootstrapCss';
        linkEl.rel = 'stylesheet';
        linkEl.href = require('!file-loader?name=static/css/[name].[ext]!bootstrap/dist/css/bootstrap.min.css');
        linkEl.addEventListener('load', processLoaded, false);
        headEl.appendChild(linkEl);

        this.totalLoadItem++;
    },
    mounted() {
        this.$nextTick(() => {
            this.value.elements.sort((a, b) => {
                if (a.base_css.zIndex > b.base_css.zIndex) {
                    return -1;
                } else if (a.base_css.zIndex < b.base_css.zIndex) {
                    return 1;
                }
                return 0;
            });
            let maxZIndexFilter = this.value.elements.filter((item) => {
                if (item.base_css.zIndex < 2000) {
                    return item;
                }
            });

            if (maxZIndexFilter.length > 0) {
                this.editorData.layout.zIndex = maxZIndexFilter[0].base_css.zIndex + 1;
            }
        });
    },
    beforeDestroy() {
        // 当编辑器被移除前，需要将原先加载进来的资源文件删除
        let aMapSdkEl = document.getElementById("amapsdk");
        let bootstrapCssEl = document.getElementById("bootstrapCss");
        if (aMapSdkEl.tagName.toLowerCase() == 'script') {
            aMapSdkEl.remove();
        }
        if (bootstrapCssEl.tagName.toLowerCase() == 'link') {
            bootstrapCssEl.remove();
        }

        this.unselectElemnt();
    },
    methods: {
        // methods
        getEditorData() {
            return this.editorData;
        },
        unselectElemnt() {
            let selectElementIndex = this.editorData.select.elementIndex;

            for (let i = 0; i < selectElementIndex.length; i++) {
                this.bodyChildren.$refs[`component_${selectElementIndex[i]}`][0].unselect();

                let element = this.value.elements[selectElementIndex[i]];
                if (element.elementable_type == 'text') {
                    this.bodyChildren.$refs[`component_${selectElementIndex[i]}`][0].destroyEditor();
                }
            }

            this.editorData.select.elementIndex = [];
            this.editorData.contextMenu.isShow = false;
            this.editorData.contextMenu.elementIndex = [];
        },
        elementChange(elementIndex) {
            this.editorData.select.elementIndex.push(elementIndex);
            this.editorData.contextMenu.elementIndex.push(elementIndex);
        },

        // emit
        onElementUnselect() {
            this.unselectElemnt();
            this.$emit('elementchange', this.editorData.select);
        },
        onElementChange(elementIndex) {
            if (this.editorData.currentAction.multiSelect == false) {
                this.unselectElemnt();
            }

            this.elementChange(elementIndex);
            this.$emit('elementchange', this.editorData.select);
        },
        onElementDblClick(elementIndex) {
            this.$emit('elementdblclick', this.editorData.select);
        },
        onEditorHeaderSelect() {
            this.onElementUnselect();
            this.$emit('headerselect');
        },
        onSaveButtonClick() {
            this.onElementUnselect();
            this.$emit('savebuttonclick');
        },
        onDeleteElement() {
            let editorEvent = new EditorEvent('deleteelement');
            editorEvent.setElementIndex(this.editorData.select.elementIndex);
            this.$emit('elementdelete', editorEvent);
            return editorEvent;
        },
        onCopyElement() {
            let editorEvent = new EditorEvent('copyelement');
            editorEvent.setElementIndex(this.editorData.select.elementIndex);
            this.$emit('elementcopy', editorEvent);
            return editorEvent;
        },
        onPasteElement() {
            let editorEvent = new EditorEvent('pasteelement');
            editorEvent.setElementIndex(null);
            editorEvent.pasteElement = this.editorData.clipboardElement;

            this.$emit('elementpaste', editorEvent);
            return editorEvent;
        },
        onEditorElementEdit() {
            this.editorData.contextMenu.isShow = false;
            this.onElementDblClick();
        },
        onEditorElementCopy() {
            let arrElementIndex = this.editorData.select.elementIndex;
            if (arrElementIndex.length > 0) {
                let ret = this.onCopyElement();
                if (ret.cancelable == false) {
                    this.copyElement();
                }
            }
            this.editorData.contextMenu.isShow = false;
        },
        onEditorElementPaste() {
            if (this.editorData.clipboardElement.length > 0) {
                let ret = this.onPasteElement();
                if (ret.cancelable == false) {
                    this.pasteElement(ret.pasteElement);
                }
            }
        },
        onEditorElementDelete() {
            let arrElementIndex = this.editorData.select.elementIndex;
            if (arrElementIndex.length == 1) {
                let ret = this.onDeleteElement();
                if (ret.cancelable == false) {
                    this.deleteElement(arrElementIndex[0]);
                }
            }
            this.editorData.contextMenu.isShow = false;
        },
        onEditorMoveTop1Layer() {
            this.process1Layer('top1layer');
        },
        onEditorMoveBottom1Layer() {
            this.process1Layer('bottom1layer');
        },
        onEditorMoveTop() {
            let arrElementIndex = this.editorData.select.elementIndex;
            if (arrElementIndex.length == 1) {
                let currentZIndex = this.value.elements[arrElementIndex[0]].base_css.zIndex;
                let elementFilter = this.value.elements.filter((item) => {
                    return item.base_css.zIndex > currentZIndex;
                });

                for (let i = 0; i < elementFilter.length; i++) {
                    elementFilter[i].base_css.zIndex--;
                }

                this.value.elements[arrElementIndex[0]].base_css.zIndex = this.editorData.layout.zIndex - 1;
            }

            this.editorData.contextMenu.isShow = false;
        },
        onEditorMoveBottom() {
            let arrElementIndex = this.editorData.select.elementIndex;
            if (arrElementIndex.length == 1) {
                let elementFilter = this.value.elements.filter((item) => {
                    return item.base_css.zIndex >= 1;
                });

                for (let i = 0; i < elementFilter.length; i++) {
                    elementFilter[i].base_css.zIndex++;
                }

                this.value.elements[arrElementIndex[0]].base_css.zIndex = 1;
            }

            this.editorData.contextMenu.isShow = false;
        },

        process1Layer(type) {
            let arrElementIndex = this.editorData.select.elementIndex;
            if (arrElementIndex.length == 1) {
                let currentZIndex = this.value.elements[arrElementIndex[0]].base_css.zIndex;
                let compareZIndex = currentZIndex;
                if (type == 'top1layer') {
                    compareZIndex++;
                } else if (type == 'bottom1layer') {
                    compareZIndex--;
                }

                let elementFilter = this.value.elements.filter((item) => {
                    return item.base_css.zIndex == compareZIndex;
                });

                if (elementFilter.length == 1) {
                    elementFilter[0].base_css.zIndex = currentZIndex;
                    this.value.elements[arrElementIndex[0]].base_css.zIndex = compareZIndex;
                }
            }

            this.editorData.contextMenu.isShow = false;
        },

        // api
        createElement(options) {
            if (this.editorData.select.elementIndex.length > 0) {
                for (let i = 0; i < this.editorData.select.elementIndex.length; i++) {
                    this.bodyChildren.$refs[`component_${this.editorData.select.elementIndex[i]}`][0].unselect();
                }
            }

            // 不允许添加多个tabbar
            if (options.elementable_type == 'tabbar') {
                let tabbarCount = this.value.elements.filter(item => item.elementable_type == 'tabbar');
                if (tabbarCount != 0) {
                    return false;
                }
            }

            this.value.elements.push(options);

            this.$nextTick(() => {
                let lastElementIndex = this.value.elements.length - 1;
                this.bodyChildren.$refs[`component_${lastElementIndex}`][0].select();

                this.elementChange(lastElementIndex);
                this.$emit('elementchange', this.editorData.select);
            });

            this.editorData.layout.zIndex++;

            return true;
        },
        deleteElement(elementIndex) {
            this.unselectElemnt();
            this.value.elements.splice(elementIndex, 1);
        },
        checkElementInfo() {
            for (let i = 0; i < this.value.elements.length; i++) {
                if (isNaN(this.value.elements[i].base_css.top)) {
                    this.value.elements[i].base_css.top = this.bodyChildren.$refs[`component_${i}`][0].$el.style.top;
                }
                if (isNaN(this.value.elements[i].base_css.left)) {
                    this.value.elements[i].base_css.left = this.bodyChildren.$refs[`component_${i}`][0].$el.style.left;
                }
            }
        },

        onEditorClick(e) {
            // 根据坐标判断是否点击外部元素
            let wrapperRect = this.wrapperChildren.$el.getBoundingClientRect();

            if (e.pageX <= wrapperRect.left || e.pageX >= wrapperRect.right || e.pageY <= wrapperRect.top || e.pageY >= wrapperRect.bottom) {
                if (e.target == this.$el) {
                    this.onElementUnselect();
                }
            }
        },
        handleContextMenu(e) {
            let elRect = this.$el.getBoundingClientRect();
            let offsetX = e.pageX - elRect.left;
            let offsetY = e.pageY - elRect.top + this.$el.scrollTop;

            e.preventDefault();
            if (e.target.classList.contains('editor-body') || e.target.classList.contains('design-editor')) {
                this.unselectElemnt();
            }

            this.editorData.contextMenu.isShow = true;
            this.editorData.contextMenu.position.left = offsetX;
            this.editorData.contextMenu.position.top = offsetY;
        },
        copyElement() {
            let elementIndex = this.editorData.select.elementIndex;

            let arrChilpboard = [];
            for (let i = 0; i < elementIndex.length; i++) {
                arrChilpboard.push(JSON.parse(JSON.stringify(this.value.elements[elementIndex[i]])));
            }

            this.editorData.clipboardElement = arrChilpboard;
        },
        pasteElement(element) {
            this.unselectElemnt();
            let arrElementData = JSON.parse(JSON.stringify(element));
            for (let i = 0; i < arrElementData.length; i++) {
                arrElementData[i].base_css.top += 5;
                arrElementData[i].base_css.left += 5;
                arrElementData[i].base_css.zIndex = this.editorData.layout.zIndex;
                this.createElement(arrElementData[i]);
            }

            let updatedElementIndex = [];
            for (let i = this.value.elements.length - 1; i >= this.value.elements.length - arrElementData.length; i--) {
                updatedElementIndex.push(i);
            }

            this.$nextTick(() => {
                this.unselectElemnt();
                this.editorData.currentAction.multiSelect = true;
                let comEditorBody = this.$el.querySelector(".editor-body").__vue__;
                for (let i = 0; i < updatedElementIndex.length; i++) {
                    comEditorBody.$refs[`component_${updatedElementIndex[i]}`][0].select();
                    comEditorBody.$refs[`component_${updatedElementIndex[i]}`][0].$children[0].notifySelect();
                }
                this.copyElement();
                this.editorData.currentAction.multiSelect = false;
            });
        },
        getZIndex() {
            return this.editorData.layout.zIndex;
        }
    }
}
</script>


<style scoped>
    .design-editor {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f5f5f4;
        user-select: none;
        overflow-y: scroll;
    }
    .loading {
        pointer-events: none;
    }
</style>

