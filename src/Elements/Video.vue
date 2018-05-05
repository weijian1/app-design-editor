<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.element_type">
    <div class="content-inner">
        <span class="play-btn"><span></span></span>
    </div>
  </element-border>
</template>


<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            isEditing: false,
            tempContent: ''
        }
    },
    components: {
        ElementBorder
    },
    props: {
        value: {
            
        }
    },
    methods: {

    }
}
</script>


<style lang="scss" scoped>
    .content-inner {
        background-color: #4d4d4d;
    }
    .play-btn {
        display: block;
        width: 76px;
        height: 76px;
        background-color: #fff;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border-radius: 76px;
        &:before {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 12px solid transparent;
            border-left: 20px solid #4d4d4d;
            border-bottom: 12px solid transparent; 
            position: absolute;
            top: 0;
            left: 5px;
            right: 0;
            bottom: 0;
            margin: auto;
        }
    }
</style>
