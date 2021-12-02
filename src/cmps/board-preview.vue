<template>
    <router-link :to="`/board/${board._id}`">
        <div class="board-preview" :style="board._id.style">
            <h4 class="board-preview-title">{{ board.title }}</h4>
            <span :class="{ starred: isStarred }" @click.prevent="log">☆</span>

            <!-- <button @click="removeBoard">...</button> -->
        </div>
    </router-link>

    <!-- <i v-if="hover" class="star-favicon">star</i> -->
</template>

<script>
    export default {
        name: 'boardPreview',
        props: {
            board: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Board' };
                },
            },
        },
        data() {
            return {
                isStarred: false,
            };
        },
        methods: {
            log() {
                console.log('hi');
                this.isStarred = !this.isStarred;
            },
        },
    };
</script>
