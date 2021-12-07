<template>
    <section class="bgc-aside-menu">
        <div
            class="color-div"
            :style="{ 'background-color': color }"
            v-for="(color, i) in colorList"
            :key="i"
            :id="'color-div' + i"
            @click="chooseBg('color', color)"
            :class="{ colorChoice: style.bgColor === color }"
        ></div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                colorList: [
                    '#0079bf',
                    '#d29034',
                    '#519839',
                    '#b04632',
                    '#89609e',
                    '#cd5a91',
                    '#4bbf6b',
                    '#00aecc',
                    '#afafaf',
                ],
                style: {
                    bgColor: '',
                    bgImg: 'none',
                },
            };
        },

        methods: {
            chooseBg(style) {
                this.style.bgColor = style;
                this.$emit('chosenBg', this.style);
            },
        },
    };
</script>
