<template>
    <section class="board-header">
        <!-- drop-dawn menu (board,map,calender) -->
        <el-select v-model="value" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
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
                options: [
                    {
                        value: 'board',
                        label: 'board',
                    },
                    {
                        value: 'Map',
                        label: 'Map',
                    },
                    {
                        value: 'Calender',
                        label: 'Calender',
                    },
                ],
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
