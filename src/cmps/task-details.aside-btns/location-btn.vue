<template>
    <section>
        <div class="location-search-container"></div>
        <div class="action-btn-content" slot="reference" @click="$emit('toggleMap')">
            <svg viewBox="0 0 24 24">
                <path :d="data.btn.d"></path>
            </svg>
            <span>{{ data.btn.name }}</span>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Data' };
                },
            },
        },
    };
</script>
