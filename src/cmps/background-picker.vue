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
        <template v-if="withImgBg">
            <div
                class="color-box"
                :style="{
                    'background-image': `url(${require('@/assets/img/' +
                        image)})`,
                }"
                v-for="(image, j) in imageList"
                :key="'a' + j"
                :id="'color-box' + 'a' + j"
                @click="chooseBg('image', image)"
                :class="{
                    colorChoice:
                        style.bgImg ===
                        `url(${require('@/assets/img/' + image)})`,
                }"
            ></div
        ></template>
    </section>
</template>

<script>
    export default {
        props: {
            withImgBg: {
                type: Boolean,
                default: true,
            },
        },
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
                    '#172b4d',
                    '#f5dd29',
                    '#d59a47',
                ],
                imageList: [
                    '5.jpg',
                    '2.jpg',
                    '3.jpg',
                    '7.jpg',
                    '6.jpg',
                    '1.jpg',
                ],
                style: {
                    bgColor: '',
                    bgImg: '',
                },
            };
        },
        created() {
            // console.log('withImgBg', this.withImgBg);
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
