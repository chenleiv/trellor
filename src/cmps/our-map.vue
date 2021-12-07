<template>
    <section>
        <form class="map-form">
            <el-input
                type="text"
                placeholder="Search Google Maps"
                v-model="searchVal"
                autofocus
                class="map-input"
            ></el-input>
            <el-button
                @click="searchLoc"
                type="info"
                class="map-search-btn"
                plain
                >Locate</el-button
            >
        </form>

        <section class="card-back-location-footer">
            <div>
                <div class="card-back-location-details">
                    <div class="quiet">{{ locAddress }}</div>
                </div>
            </div>
            <el-popover
                placement="bottom"
                :title="locAddress"
                width=""
                trigger="click"
                content=""
                class="remove-map-modal"
            >
                <hr />
                <h4 class="remove-map-inner-btn" @click="$emit('removeMap')">
                    Remove
                </h4>
                <span class="remove-map-btn" slot="reference"></span>
            </el-popover>
        </section>

        <GmapMap
            ref="mapRef"
            :center="center"
            :zoom="10"
            map-type-id="terrain"
            style="width: 480px; height: 240px"
        >
            <GmapMarker
                :position="center"
                :clickable="true"
                :draggable="false"
            />
        </GmapMap>
        <!-- @click="center = pos" -->
        <!-- <el-button
            v-for="(marker, idx) in markers"
            :key="idx"
            @click="moveTo(marker.position)"
            >{{ marker.city }}</el-button -->
        <!-- > -->
    </section>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                searchVal: '',
                API_KEY: 'AIzaSyAwGiZvHMgXknOgVGzfiqUHedPY-M9aRpM',
                center: { lat: 31.769218, lng: 35.208144 },
                locAddress: '',
            };
        },

        created() {},

        methods: {
            moveTo(position) {
                this.center = position;
                const { lat, lng } = position;
                this.$refs.mapRef.$mapPromise
                    .then((map) => {
                        map.panTo({ lat, lng });
                    })
                    .then(this.getLocAddress(this.center.lat, this.center.lng));
            },

            searchLoc() {
                axios
                    .get(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.searchVal}&key=${this.API_KEY}`
                    )
                    .then((res) => res.data.results[0].geometry.location)
                    .then(this.moveTo);
            },

            getLocAddress(lat, lng) {
                return axios
                    .get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`
                    )
                    .then((res) => {
                        this.locAddress = res.data.results[0].formatted_address;
                    });
            },
        },
        computed: {},
    };
</script>
