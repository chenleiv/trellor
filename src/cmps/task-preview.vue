<template>
    <section class="task-preview">
        <router-link :to="`/board/${boardId}/task/${task.id}`">
            <div>
                {{ task.title }}
                <button class="edit-task-btn btn-group"></button>
            </div>
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
