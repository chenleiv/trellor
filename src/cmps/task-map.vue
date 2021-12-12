<template>
    <section class="map-container">
        <form class="map-form" @submit.prevent="searchLoc">
            <el-input
                type="text"
                v-model="searchVal"
                placeholder="Search Google Maps"
                class="map-input"
                autofocus
            ></el-input>

            <button>
                <el-button type="info" class="map-search-btn" plain
                    >Locate</el-button
                >
            </button>
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
                trigger="click"
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
            :center="mapCenter"
            :zoom="10"
            map-type-id="terrain"
            class="map"
        >
            <GmapMarker
                :position="mapCenter"
                :clickable="true"
                :draggable="false"
            />
        </GmapMap>
    </section>
</template>

<script>
    import { taskMapService } from '@/services/task-map.service.js';

    export default {
        props: {
            location: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Location' };
                },
            },
        },

        data() {
            return {
                searchVal: '',
                mapCenter: this.location.coords,
                locAddress: this.location.address,
            };
        },

        methods: {
            async moveTo(location) {
                try {
                    this.mapCenter = location;
                    const { lat, lng } = location;
                    const map = await this.$refs.mapRef.$mapPromise;
                    await map.panTo({ lat, lng });
                    const address = await this.getLocAddress(
                        this.mapCenter.lat,
                        this.mapCenter.lng
                    );
                    this.$emit('saveLoc', {
                        address,
                        coords: { lat, lng },
                    });
                } catch (err) {
                    console.log('Error in moveTo (task-map):', err);
                    throw err;
                }
            },

            async searchLoc() {
                try {
                    const res = await taskMapService.searchLoc(this.searchVal);
                    const location = res.data.results[0].geometry.location;
                    this.moveTo(location);
                    this.searchVal = '';
                } catch (err) {
                    console.log('Error in searchLoc (task-map):', err);
                    throw err;
                }
            },

            async getLocAddress(lat, lng) {
                try {
                    const res = await taskMapService.getLocAddress(lat, lng);
                    this.locAddress = res.data.results[0].formatted_address;
                    return this.locAddress;
                } catch (err) {
                    console.log('Error in getLocAddress (task-map):', err);
                    throw err;
                }
            },
        },
    };
</script>
