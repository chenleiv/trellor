<template>
    <section class="board-header">
        <!-- drop-dawn menu (board,map,calender) -->
        <el-select
            class="el-select"
            v-model="value"
            collapse-tags
            style="margin-left: 20px"
            placeholder="select"
        >
            <el-option value="Board">Board</el-option>
            <el-option value="Map"> Map</el-option>
            <el-option value="Calendar">Calendar</el-option>
        </el-select>

        {{ board.title }}
        <button>Dashboard</button>

        <div>
            Members in the board
            <button>+ invite users</button>
        </div>

        <!-- filter button open dropdown -->
        <!-- <board-filter></board-filter> -->

        <button class="menu-btn" @click="openMenu">Show menu</button>

        <aside-menu :class="menuVisibility" />
    </section>
</template>

<script>
    import asideMenu from '@/cmps/aside-menu.vue';
    import BoardFilter from '@/cmps/board-filter.vue';

    export default {
        name: 'boardHeader',
        props: ['board'],

        data() {
            return {
                isMenuOpen: false,
                value: '',
            };
        },

        methods: {
            openMenu() {
                this.isMenuOpen = !this.isMenuOpen;
            },
        },

        computed: {
            menuVisibility() {
                return { 'aside-menu-open': this.isMenuOpen };
            },
        },

        components: {
            asideMenu,
            BoardFilter,
        },
    };
</script>
