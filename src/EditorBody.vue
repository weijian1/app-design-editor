<template>
  <div class="editor-body" :style="propertyCss | Obj2CSS" @click="unselectElemnt">
      <template v-for="(element, index) in value.elements">
        <component :is="`element-${element.elementable_type}`" v-model="value.elements[index]" :ref="`component_${index}`" :index="index" @elementchange="onElementChange"></component>
      </template>
  </div>
</template>

<script>
import ElementText from './Elements/Text.vue'
import EditorMinxin  from './Mixins/Editor'
import Obj2CSS from './Filters/Obj2CSS'

export default {
    mixins: [ EditorMinxin ],
    components: {
        ElementText
    },
    data() {
        return {
            selectElementIndex: null
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
                this.editorParent.unselectElemnt();
            }
        },
        onElementChange(index) {
            if (this.selectElementIndex !== null && this.selectElementIndex >= 0) {
                this.$refs[`component_${this.selectElementIndex}`][0].unselect();
            }
            this.selectElementIndex = index;
            this.editor.$emit('elementchange', {
                elementIndex: index
            });
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

<style scoped>
    .editor-body {
        width: 100%;
        height: 603px;
        position: relative;
        background-color: white;
        border-left: 1px solid #f2f2f2;
        border-right: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
    }
</style>
