<template>
    <div class="task-checklists">
        <div class="task-activities">
            <div class="window-modal-title">
                <div class="task-activities-header"></div>
                <button class="activity-toggle-btn">Delete</button>
            </div>
            <div class="checklist-progress">
                <span class="checklist-progress-percentage">0%</span>
                <div class="checklist-progress-bar">
                    <div class="checklist-progress-bar-current"></div>
                    <h1>Progress:</h1>
                    <div class="bar-container">
                        <div
                            class="prog-bar"
                            v-bind:style="{ width: width + '%' }"
                        >
                            {{ width }}%
                        </div>
                    </div>
                </div>
            </div>
            <div class="todo-list">
                <div class="todo-preview-container">
                    <div class="todo-preview">
                        <div class="checklist-txt-and-btn">
                            <span class=""></span>
                        </div>
                    </div>
                    <div class="checklist-btns hidden">
                        <button class="nch-btn">Save</button>
                    </div>
                </div>
            </div>
            <div class="todo-add-container">
                <button class="task-btns nch-btn todo-add-btn show">
                    Add an item
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['checklistTitle'],
        data() {
            return {
                checklists: [
                    {
                        id: '',
                        title: '',
                        todos: [
                            {
                                id: '',
                                title: '',
                                isDone: false,
                            },
                        ],
                    },
                ],
            };
        },
        methods: {},
        computed: {},
    };
</script>
