<template>
    <div class="filter-menu">
        <div class="filter-header">
            <h3 class="header">Filter</h3>
            <button
                class="el-icon-close"
                style="font-size: 20px"
                @click="closeMenu"
            ></button>
        </div>
        <hr />
        <div class="filter-content">
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BoardFilter',

        methods: {
            closeMenu() {
                this.$emit('openFilter');
            },
        },
    };
</script>
