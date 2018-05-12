<template>
    <div class="design-editor">
        <editor-wrapper v-model="value" :header="appHeader" :footer="appFooter"></editor-wrapper>
    </div>
</template>


<script>
import EditorWrapper from './EditorWrapper.vue'
import EditorMinxin  from './Mixins/Editor'

export default {
    name: 'app-design-editor',
    components: {
        EditorWrapper
    },
    mixins: [ EditorMinxin ],
    props: {
        value: {
            required: true
        },
        appHeader: {
            required: true
        },
        appFooter: {
            required: true
        },
        amapConfig: {
            
        }
    },
    data() {
        return {
            editorData: {
                select: {
                    elementIndex: null
                },
                currentAction: {
                    resize: false,
                    rotate: false,
                    move: false
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
            scriptEl.src = `http://webapi.amap.com/maps?v=1.4.6&key=${this.amapConfig.apiKey}`;
            scriptEl.addEventListener('load', processLoaded, false);
            headEl.appendChild(scriptEl);

            this.totalLoadItem++;
        }

        let linkEl = document.createElement("link");
        linkEl.id = 'bootstrapCss';
        linkEl.rel = 'stylesheet';
        linkEl.href = require('!file-loader?name=static/css/[name].[ext]!bootstrap/dist/css/bootstrap.min.css');;
        linkEl.addEventListener('load', processLoaded, false);
        headEl.appendChild(linkEl);

        this.totalLoadItem++;
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
    },
    methods: {
        // methods
        getEditorData() {
            return this.editorData;
        },
        unselectElemnt() {
            if (this.editorData.select.elementIndex !== null) {
                this.bodyChildren.$refs[`component_${this.editorData.select.elementIndex}`][0].unselect();

                this.elementChange(null);
                this.$emit('elementchange', this.editorData.select);
            }
        },
        elementChange(elementIndex) {
            this.editorData.select.elementIndex = elementIndex;
        },

        // emit
        onElementChange(elementIndex) {
            if (this.editorData.select.elementIndex !== null) {
                this.bodyChildren.$refs[`component_${this.editorData.select.elementIndex}`][0].unselect();
            }

            this.elementChange(elementIndex);
            this.$emit('elementchange', this.editorData.select);
        },
        onElementDblClick(elementIndex) {
            this.$emit('elementdblclick', this.editorData.select);
        },
        onEditorHeaderSelect() {
            this.unselectElemnt();
            this.$emit('headerselect');
        },
        onSaveButtonClick() {
            this.unselectElemnt();
            this.$emit('savebuttonclick');
        },

        // api
        createElement(options) {
            if (this.editorData.select.elementIndex !== null) {
                this.bodyChildren.$refs[`component_${this.editorData.select.elementIndex}`][0].unselect();
            }

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

            return true;
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
</style>

