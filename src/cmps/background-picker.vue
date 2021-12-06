<template>
    <section class="background-picker">
        <div
            class="color-box"
            :style="{ 'background-color': color }"
            v-for="(color, i) in colorList"
            :key="i"
            :id="'color-box' + i"
            @click="chooseBg('color', color)"
            :class="{ colorChoice: style.bgColor === color }"
        ></div>
        <div
            class="color-box"
            :style="{
                'background-image': `url(${require('@/assets/img/' + image)})`,
            }"
            v-for="(image, j) in imageList"
            :key="'a' + j"
            :id="'color-box' + 'a' + j"
            @click="chooseBg('image', image)"
            :class="{
                colorChoice:
                    style.bgImg === `url(${require('@/assets/img/' + image)})`,
            }"
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
                imageList: ['5.jpg', '2.jpg', '3.jpg'],
                style: {
                    bgColor: '',
                    bgImg: '',
                },
            };
        },

        methods: {
            chooseBg(val, styleEl) {
                console.log('', val);
                if (val === 'color') {
                    this.style.bgImg = 'none';
                    this.style.bgColor = styleEl;
                } else {
                    this.style.bgColor = 'none';
                    this.style.bgImg = `url(${require('@/assets/img/' +
                        styleEl)})`;
                }

                this.$emit('chosenBg', this.style);
            },
        },
    };
</script>
