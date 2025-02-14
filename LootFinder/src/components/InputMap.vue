<template>
    <GoogleMap :api-key="mapsKey" :zoom="15" :center="center" @click="placeMarker" style="width: 75%; height: 400px; border-radius: 1rem; overflow: hidden; border-width: 2px; border-color: #834848">
        <Marker v-if="markerVisible" :options="markerOptions"/>
    </GoogleMap>
</template>

<script>
    import { defineComponent } from 'vue';
    import { GoogleMap, Marker } from 'vue3-google-map';
    import config from '@/config';

    export default defineComponent({
        name: 'InputMap',
        components: {
            GoogleMap,
            Marker,
        },
        setup(){
            const mapsKey = config.mapsKey;
            return {
                mapsKey,
            };
        },
        data() {
            return {
                center: { lat: 34.413963, lng: -119.848946 },
                markerVisible: false,
                markerOptions: {
                    position: { lat: 34.413963, lng: -119.848946 },
                    draggable: true,
                    visible: true,
                },
            };
        },
        methods: {
            placeMarker(e) {
                this.markerVisible = true;
                const newPos = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                };
                this.markerOptions = { ...this.markerOptions, position: newPos };
                this.$emit('updateLatLng', newPos);
            }
        },
    });
</script>
