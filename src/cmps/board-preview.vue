<template>
    <router-link :to="`/board/${board._id}`">
        <div class="board-preview" :style="board._id.style">
            <h4 class="board-preview-title">{{ board.title }}</h4>
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
    };
</script>
