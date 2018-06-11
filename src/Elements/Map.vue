<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners">
      <div class="content-inner" ref="map">
      </div>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import MixinEditor from './../Mixins/Editor'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement, MixinEditor ],
    data() {
        return {
            isReady: false,
            map: null,
            marker: null,
            borderListeners: {
                move: true,
                rotate: true,
                resize: true,
                resizeEqualProportion: true,
                resizeDirection: []
            }
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
        initMap() {
            let mapWrapper = this.$el.querySelector(".content-inner");
            let map = new AMap.Map(mapWrapper, {
                resizeEnable: false,
                dragEnable: false,
                zoomEnable: false,
                doubleClickZoom: false,
                keyboardEnable: false,
                center: this.currentLngLat,
                zoom: 15
            });
            this.map = map;
            this.updateMap();
        },
        updateMap() {
            if (this.marker != null) {
                this.map.remove(this.marker);
                this.marker = null;
            }

            let marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: this.currentLngLat
            });
            marker.setMap(this.map);
            this.map.setCenter(this.currentLngLat);
            this.marker = marker;
        }
    },
    mounted() {
        this.editorParent.$watch('loading', (newVal, oldVal) => {
            this.isReady = true;
            this.initMap();
        });

        this.$watch('value.map.property.lng', (newVal, oldVal) => {
            this.updateMap();
        });
        this.$watch('value.map.property.lat', (newVal, oldVal) => {
            this.updateMap();
        });

        if (this.editorParent.$data.loading == false) {
            this.initMap();
        }
    },
    computed: {
        currentLngLat() {
            if (this.value.map.property) {
                return [this.value.map.property.lng, this.value.map.property.lat];
            }
            return [];
        }
    },
    directives: {
        amap: {
            bind(el, binding) {
                let value = binding.value;

                var marker, map = new AMap.Map(el, {
                    resizeEnable: false,
                    dragEnable: false,
                    zoomEnable: false,
                    doubleClickZoom: false,
                    keyboardEnable: false,
                    center: [value.lng, value.lat],
                    zoom: 15
                });

                console.log(el);

                marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: [value.lng, value.lat]
                });
                marker.setMap(map);
            }
        },
        update() {
            console.log('update');
        }
    }
}
</script>


<style lang="scss" scoped>
    .content-inner {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>
