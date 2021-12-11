<template>
    <section class="map-container">
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
            class="map"
        >
            <GmapMarker
                :position="center"
                :clickable="true"
                :draggable="false"
            />
        </GmapMap>
    </section>
</template>

<script>
    import axios from 'axios';

    export default {
        props: {
            mapCenter: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No mapCenter' };
                },
            },
            mapAddress: {
                type: String,
                required: true,
                default: function () {
                    return { msg: 'No mapAddress' };
                },
            },
        },

        data() {
            return {
                API_KEY: 'AIzaSyAwGiZvHMgXknOgVGzfiqUHedPY-M9aRpM',
                searchVal: '',
                center: this.mapCenter,
                locAddress: this.mapAddress,
            };
        },

        methods: {
            async moveTo(position) {
                try {
                    this.center = position;
                    const { lat, lng } = position;
                    const map = await this.$refs.mapRef.$mapPromise;
                    await map.panTo({ lat, lng });
                    const address = await this.getLocAddress(
                        this.center.lat,
                        this.center.lng
                    );
                    this.$emit('saveLoc', {
                        address,
                        coords: { lat, lng },
                    });
                } catch (err) {
                    console.log('Error in moveTo (our-map):', err);
                    throw err;
                }
            },

            async searchLoc() {
                try {
                    const res = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.searchVal}&key=${this.API_KEY}`
                    );
                    const location = res.data.results[0].geometry.location;
                    this.moveTo(location);
                } catch (err) {
                    console.log('Error in searchLoc (our-map):', err);
                    throw err;
                }
            },

            async getLocAddress(lat, lng) {
                try {
                    const res = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`
                    );
                    this.locAddress = res.data.results[0].formatted_address;
                    return this.locAddress;
                } catch (err) {
                    console.log('Error in getLocAddress (our-map):', err);
                    throw err;
                }
            },
        },
    };
</script>
