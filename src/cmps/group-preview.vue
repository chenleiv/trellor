<template>
    <section class="group-preview">
        <h4 v-if="!isInputVisible" @click="toggleEditMode">
            {{ group.title }}
        </h4>

        <input
            v-else
            v-model="newTitle"
            @blur="editTitle"
            @keyup.enter="$event.target.blur()"
            type="text"
            ref="titleInput"
        />

        <ul>
            <li v-for="task in group.tasks" :key="task.id">
                <task-preview :task="task" />
            </li>
        </ul>

        <!-- <div v-if="clicked">
      <button>Add a Task</button>
    </div>
    <div v-else>
      <input type="text" placeholder="Enter a title for this task..." />
      <button>Add Task</button>
    </div> -->
    </section>
</template>

<script>
    import taskPreview from '@/cmps/task-preview.vue';

    export default {
        name: 'groupPreview',

        props: {
            group: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Group' };
                },
            },
        },

        data() {
            return {
                newTitle: JSON.parse(JSON.stringify(this.group.title)),
                isInputVisible: false,
                board: null,
            };
        },

        methods: {
            toggleEditMode() {
                this.isInputVisible = !this.isInputVisible;
                this.$nextTick(() => {
                    if (this.isInputVisible) this.$refs.titleInput.focus();
                });
            },

            async editTitle() {
                this.toggleEditMode();
                const group = JSON.parse(JSON.stringify(this.group));
                group.title = this.newTitle;
                const { boardId } = this.$route.params;
                try {
                    const board = await this.$store.dispatch({
                        type: 'updateGroup',
                        boardId,
                        group,
                    });
                    console.log(`Group Saved Succefully in ${board._id}`);
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in updateGroup (group-preview):', err);
                    throw err;
                }
            },
        },

        components: {
            taskPreview,
        },
    };
</script>
