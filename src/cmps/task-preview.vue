<template>
    <section>
        <router-link :to="`/board/${boardId}/task/${task.id}`">
            {{ task.title }}
            <!-- pencil -->
        </router-link>
    </section>
</template>

<script>
    export default {
        name: 'taskPreview',

        props: {
            task: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Task' };
                },
            },
        },

        data() {
            return {
                boardId: '',
            };
        },

        created() {
            const { boardId } = this.$route.params;
            this.boardId = boardId;
        },
    };
</script>
