<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type">
        <img class="content-inner" :src="value.img.property.src" />
        <span class="img-wrapper" :style="imgCss | Obj2CSS"></span>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementImgBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {

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
        
    },
    computed: {
        imgCss() {
            return {
                borderRadius: this.value.base_css.borderRadius,
                backgroundImage: this.value.img.property.src,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>


<style lang="scss" scoped>
    .element-content {
        .content-inner {
            width: 100%;
            height: 100%;
            pointer-events: none;
            visibility: hidden;
        }
        span.img-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: block;
        }
    }
</style>
