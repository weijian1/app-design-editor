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
            }
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

        // api
        createElement(options) {
            if (this.editorData.select.elementIndex !== null) {
                this.bodyChildren.$refs[`component_${this.editorData.select.elementIndex}`][0].unselect();
            }

            this.value.elements.push(options);

            setTimeout(() => {
                let lastElementIndex = this.value.elements.length - 1;
                this.bodyChildren.$refs[`component_${lastElementIndex}`][0].select();

                this.elementChange(lastElementIndex);
                this.$emit('elementchange', this.editorData.select);
            }, 10);
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

