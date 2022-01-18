<template>
    <section v-if="task">
        <div class="modal-background" @click.self="backToBoard">
            <section class="task-details-container">
                <template v-if="isCoverStyle">
                    <div
                        :class="{
                            'smaller-cover': taskToEdit.coverStyle.bgImg === 'none',
                        }"
                        class="cover-container"
                        :style="{
                            backgroundColor: taskToEdit.coverStyle.bgColor,
                        }"
                    >
                        <div
                            :class="{
                                'bigger-cover': taskToEdit.coverStyle.bgColor === 'transparent',
                            }"
                            class="img-cover-container"
                            :style="{
                                backgroundImage: `url(${taskToEdit.coverStyle.bgImg})`,
                            }"
                        >
                            <button @click="removeTaskCover" class="remove-cover-btn">
                                Remove Cover
                            </button>
                        </div>
                    </div>
                </template>

                <header class="task-modal-header">
                    <button class="close-modal-btn el-icon-close" @click="backToBoard"></button>
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M16.557,4.467h-1.64v-0.82c0-0.225-0.183-0.41-0.409-0.41c-0.226,0-0.41,0.185-0.41,0.41v0.82H5.901v-0.82c0-0.225-0.185-0.41-0.41-0.41c-0.226,0-0.41,0.185-0.41,0.41v0.82H3.442c-0.904,0-1.64,0.735-1.64,1.639v9.017c0,0.904,0.736,1.64,1.64,1.64h13.114c0.904,0,1.64-0.735,1.64-1.64V6.106C18.196,5.203,17.461,4.467,16.557,4.467 M17.377,15.123c0,0.453-0.366,0.819-0.82,0.819H3.442c-0.453,0-0.82-0.366-0.82-0.819V8.976h14.754V15.123z M17.377,8.156H2.623V6.106c0-0.453,0.367-0.82,0.82-0.82h1.639v1.23c0,0.225,0.184,0.41,0.41,0.41c0.225,0,0.41-0.185,0.41-0.41v-1.23h8.196v1.23c0,0.225,0.185,0.41,0.41,0.41c0.227,0,0.409-0.185,0.409-0.41v-1.23h1.64c0.454,0,0.82,0.367,0.82,0.82V8.156z"
                        ></path>
                    </svg>
                    <textarea
                        v-model="taskToEdit.title"
                        type="text"
                        @blur="updateTask"
                        @keydown.enter.prevent
                    ></textarea>
                    <p>
                        in list
                        <span>{{ group.title }}</span>
                    </p>
                </header>

                <section class="task-details-content">
                    <main>
                        <div class="task-features">
                            <div class="task-features-container">
                                <div v-if="task.members.length" class="members-container">
                                    <h4 v-if="task.members.length" class="members-to-show-header">
                                        Members
                                    </h4>
                                    <div class="member-to-show-container">
                                        <section
                                            v-for="member in task.members"
                                            :key="member._id"
                                            class="member-to-show-list"
                                        >
                                            <div class="member-to-show">
                                                <el-popover
                                                    :title="member.fullname"
                                                    placement="bottom-start"
                                                    width="200"
                                                    trigger="click"
                                                    content=""
                                                    class="member-to-show-modal"
                                                >
                                                    <avatar
                                                        :username="member.fullname"
                                                        :src="member.imgUrl"
                                                        :size="30"
                                                        class="member-modal-avatar"
                                                        backgroundColor="lightblue"
                                                        color="black"
                                                    ></avatar>
                                                    <span
                                                        class="remove-member-btn"
                                                        @click="chooseMember(member, member._id)"
                                                        >Remove from card</span
                                                    >
                                                    <avatar
                                                        :username="member.fullname"
                                                        :src="member.imgUrl"
                                                        :size="30"
                                                        slot="reference"
                                                        class="user-avatar"
                                                        backgroundColor="lightblue"
                                                        color="black"
                                                    ></avatar>
                                                </el-popover>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <div v-if="task.labelIds.length" class="labels-container">
                                    <h4 v-if="task.labelIds.length" class="labels-to-show-header">
                                        Labels
                                    </h4>
                                    <div class="label-to-show-container">
                                        <section
                                            v-for="lbId in task.labelIds"
                                            :key="lbId"
                                            class="label-to-show-list"
                                        >
                                            <div
                                                class="label-to-show"
                                                :style="{
                                                    'background-color': getLbProp(lbId, 'color'),
                                                }"
                                            >
                                                {{ getLbProp(lbId, 'title') }}
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <div class="date-container" v-if="isDateShown">
                                    <h3 class="date-to-show-header">Due date</h3>
                                    <div class="date-to-show-container">
                                        <div class="date-check-boxes">
                                            <svg
                                                v-if="!taskToEdit.isComplete"
                                                @click="markAsComplete"
                                                class="date-svg MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pointer css-vubbuv"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                                                ></path>
                                            </svg>
                                            <svg
                                                v-else
                                                @click="markAsComplete"
                                                class="date-svg MuiSvgIcon-root MuiSvgIcon-fontSizeMedium todo-check pointer css-vubbuv"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div class="date-to-show-btn secondary-btn">
                                            <span>{{ taskToEdit.dueDate }}</span
                                            ><span v-if="taskToEdit.isComplete" class="due-msg done"
                                                >complete</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <ul>
                            <li v-for="todo in todos" :key="todo._id">
                                <checklist-preview
                                    v-if="isChecklistShown"
                                    :checklistTitle="checklistTitle"
                                    :task="task"
                                    :checklists="checklists"
                                >
                                </checklist-preview>
                                <a @click.stop.prevent="remove(todos._id)">x</a>
                            </li>
                        </ul> -->

                        <section class="description-container">
                            <h4>
                                <svg>
                                    <path
                                        d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"
                                    ></path>
                                </svg>
                                <span>Description</span>
                            </h4>

                            <div class="description-edit">
                                <textarea
                                    v-model="taskToEdit.description"
                                    type="text"
                                    @click="isTextAreaVisible = true"
                                    @blur="updateTask"
                                    @focus="$event.target.select()"
                                    placeholder="Add a more detailed description..."
                                    ref="descriptionInput"
                                ></textarea>
                                <div class="description-btns" v-if="isTextAreaVisible">
                                    <el-button
                                        type="primary"
                                        class="save-task-description-btn"
                                        @click.prevent="updateTask"
                                    >
                                        <span>Save</span>
                                    </el-button>

                                    <button
                                        class="close-task-description-btn"
                                        @click.prevent="isTextAreaVisible = false"
                                    ></button>
                                </div>
                            </div>
                        </section>

                        <section
                            class="big-features-container"
                            v-if="this.isMapShown || this.taskToEdit.attachments.length"
                        >
                            <div class="attachments-container">
                                <div v-for="(attach, idx) in taskToEdit.attachments" :key="idx">
                                    <a :href="attach.url" target="_blank">
                                        <span class="attach-title">{{ attach.title }}</span
                                        ><span class="external-link-attach"></span
                                    ></a>
                                    |
                                    <span @click="removeAttachment(idx)" class="attach-btns"
                                        >Delete</span
                                    >
                                    |
                                    <el-popover placement="top" width="180" trigger="click">
                                        <input
                                            class="title-attach-edit"
                                            type="text"
                                            v-model="newAttachTitle"
                                        />
                                        <div style="text-align: right; margin: 5px">
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="editAttachmentTitle(idx)"
                                                >Confirm</el-button
                                            >
                                        </div>
                                        <el-button
                                            class="edit-attach-btn attach-btns"
                                            slot="reference"
                                            @click="newAttachTitle = attach.title"
                                            >Edit</el-button
                                        >
                                    </el-popover>

                                    <div
                                        class="attachments-img"
                                        :style="{
                                            backgroundImage: `url(${attach.url})`,
                                        }"
                                    ></div>
                                    <span
                                        class="attach-btns"
                                        v-if="!attach.isCover"
                                        @click="toggleAttachCover(idx)"
                                        >Make cover</span
                                    >
                                    <span
                                        class="attach-btns"
                                        v-if="attach.isCover"
                                        @click="removeTaskCover"
                                        >Remove cover</span
                                    >
                                </div>
                            </div>

                            <div v-if="isMapShown">
                                <GmapMap
                                    :location="location"
                                    :options="{
                                        zoomControl: true,
                                        mapTypeControl: true,
                                        scaleControl: false,
                                        streetViewControl: true,
                                        rotateControl: false,
                                        fullscreenControl: true,
                                        disableDefaultUi: false,
                                    }"
                                    @saveLoc="saveLoc"
                                    @removeMap="removeMap"
                                />
                            </div>
                        </section>

                        <section class="activity-container">
                            <header class="activity-header">
                                <h4>
                                    <svg>
                                        <path
                                            d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
                                        ></path>
                                    </svg>
                                    <span>Activity</span>
                                </h4>
                                <button @click="showDetails">
                                    {{ showDetailsBtnTxt }}
                                </button>
                            </header>
                            <div class="comments-container">
                                <avatar
                                    v-if="loggedInUser"
                                    :username="loggedInUser.fullname"
                                    :src="loggedInUser.imgUrl"
                                    :size="30"
                                    class="user-avatar"
                                    backgroundColor="lightblue"
                                    color="black"
                                ></avatar>
                                <avatar
                                    v-else
                                    username="Guest"
                                    :size="30"
                                    class="user-avatar"
                                    backgroundColor="lightblue"
                                    color="black"
                                ></avatar>

                                <textarea
                                    v-model="commentTxt"
                                    type="text"
                                    placeholder="Write a comment..."
                                    @click="isCommentInputOpen = true"
                                    @blur="closeCommentInput"
                                    @keyup="isComment = commentTxt ? true : false"
                                    ref="commInput"
                                />
                            </div>
                            <button
                                class="save-comment-btn"
                                :class="[
                                    { hidden: !isCommentInputOpen },
                                    { 'save-comment-btn-typing-style': isComment },
                                ]"
                                @click="addComment"
                                :disabled="!commentTxt.trim()"
                            >
                                <span>Save</span>
                            </button>

                            <div class="comments-list">
                                <div
                                    v-for="(comment, idx) in task.comments"
                                    :key="comment.createdAt"
                                    class="activity-preview-container"
                                >
                                    <avatar
                                        v-if="loggedInUser"
                                        :username="loggedInUser.fullname"
                                        :src="loggedInUser.imgUrl"
                                        :size="30"
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                    ></avatar>
                                    <avatar
                                        v-else
                                        username="Guest"
                                        :size="30"
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                    ></avatar>
                                    <div class="activity-details">
                                        <div class="activity-member-container">
                                            <span class="member-name" v-if="loggedInUser">{{
                                                loggedInUser.fullname
                                            }}</span>
                                            <span class="member-name" v-else>Guest</span>
                                            <span class="activity-created-at-container">
                                                <span class="activity-created-at">{{
                                                    commentTimeToShow(comment.createdAt)
                                                }}</span>
                                            </span>
                                        </div>
                                        <div class="comment-content">
                                            {{ comment.txt }}
                                        </div>
                                    </div>
                                    <h5 @click="deleteComment(idx)">Delete</h5>
                                </div>
                            </div>

                            <div class="activity-list" v-if="activityListIsShown">
                                <div
                                    v-for="activity in board.activities"
                                    :key="activity.id"
                                    class="activity-preview-container"
                                >
                                    <avatar
                                        username="Guest"
                                        :size="30"
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                    ></avatar>
                                    <div class="activity-details">
                                        <div class="activity-member-container">
                                            <span class="member-name">{{
                                                activity.byMember.fullname
                                            }}</span
                                            ><span class="activity-content">{{
                                                activity.txt
                                            }}</span>
                                        </div>
                                        <div class="activity-created-at-container">
                                            <span class="activity-created-at">3 Days Ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside>
                        <div class="suggested" v-if="!isMemberIncluded(loggedInUser._id)">
                            <h4 class="aside-headers">Suggested</h4>
                            <button
                                class="secondary-btn action-btn"
                                @click="chooseMember(loggedInUser, loggedInUser._id)"
                            >
                                <div class="action-btn-content">
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
                                        ></path>
                                    </svg>
                                    <span>Join</span>
                                </div>
                            </button>
                        </div>

                        <div class="add-to-card">
                            <h4 class="aside-headers">Add to card</h4>
                            <component
                                v-for="btn in asideBtns"
                                :key="btn.id"
                                :is="btn.name"
                                :data="{ btn, board, task, taskToEdit, labels }"
                                v-on="{
                                    updateTask,
                                    updateBoard,
                                    chooseMember,
                                    toggleDate,
                                    toggleMap,
                                    removeTaskCover,
                                }"
                                class="secondary-btn action-btn"
                            ></component>
                        </div>
                    </aside>
                </section>
            </section>
        </div>
    </section>
</template>

<script>
    import Members from '@/cmps/task-details.aside-btns/members-btn';
    import Labels from '@/cmps/task-details.aside-btns/labels-btn';
    import Checklist from '@/cmps/task-details.aside-btns/checklist-btn';
    import Dates from '@/cmps/task-details.aside-btns/dates-btn';
    import Attachment from '@/cmps/task-details.aside-btns/attachment-btn';
    import Location from '@/cmps/task-details.aside-btns/location-btn';
    import Cover from '@/cmps/task-details.aside-btns/cover-btn';
    import checklistPreview from '@/cmps/checklist-preview';
    import GmapMap from '@/cmps/task-map';
    import avatar from 'vue-avatar';
    import moment from 'moment';

    export default {
        name: 'taskDetails',

        data() {
            return {
                task: null,
                group: null,
                taskToEdit: {},
                taskTitle: '',
                isTextAreaVisible: false,
                isComment: false,
                isCommentInputOpen: false,
                commentTxt: '',
                activityListIsShown: false,
                showDetailsBtnTxt: 'Show details',
                asideBtns: [
                    {
                        id: 'b101',
                        name: 'Members',
                        d: 'M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4zm-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4zm2 0c.2-.71 3.3-2 6-2 2.69 0 5.78 1.28 6 2H3zm17-3v-3h3v-2h-3V7h-2v3h-3v2h3v3h2z',
                    },
                    {
                        id: 'b102',
                        name: 'Labels',
                        d: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z',
                    },
                    // {
                    //     id: 'b103',
                    //     name: 'Checklist',
                    //     d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z',
                    // },
                    {
                        id: 'b104',
                        name: 'Dates',
                        d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
                    },
                    {
                        id: 'b105',
                        name: 'Attachment',
                        d: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
                    },
                    {
                        id: 'b106',
                        name: 'Location',
                        d: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
                    },
                    {
                        id: 'b107',
                        name: 'Cover',
                        d: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z',
                    },
                ],
                labels: [],
                isBigFeatureShown: false,
                newAttachTitle: '',
                isDateShown: false,
                isMapShown: false,
                location: {
                    coords: { lat: 31.769218, lng: 35.208144 },
                    address: 'Jerusalem',
                },
            };
        },

        created() {
            this.loadData();
        },

        methods: {
            async loadData() {
                const { board } = this;
                const { taskId } = this.$route.params;
                try {
                    this.labels = this.board.labels;
                    // Loading Task:
                    const taskArr = board.groups.map((group) => {
                        return group.tasks.find((task) => {
                            return task.id === taskId;
                        });
                    });
                    this.task = taskArr.find((item) => item !== undefined);
                    this.taskTitle = this.task.title;
                    // Loading Group:
                    const group = board.groups.find((gr) => gr.tasks.includes(this.task));
                    this.group = group;
                    this.taskToEdit = this.task;
                    this.keepMap(this.taskToEdit);
                    this.isDate(this.taskToEdit);
                } catch (err) {
                    console.log('Error in loadData (task-details):', err);
                    throw err;
                }
            },

            async updateTask() {
                this.isTextAreaVisible = false;
                try {
                    await this.$store.dispatch({
                        type: 'updateTask',
                        boardId: this.board._id,
                        groupId: this.group.id,
                        task: this.taskToEdit,
                    });
                    console.log(`Task Succefully Updated with Id ${this.taskToEdit.id}`);
                } catch (err) {
                    console.log('Error in updateTask (task-details):', err);
                    throw err;
                } finally {
                    this.$refs.commInput.value = '';
                    this.commentTxt = '';
                }
            },

            async updateBoard(board) {
                try {
                    await this.$store.dispatch({
                        type: 'updateBoard',
                        board,
                    });
                    console.log(`Board Succefully Updated with Id ${board._id}`);
                } catch (err) {
                    console.log('Error in updateBoard (task-details):', err);
                    throw err;
                }
            },

            closeCommentInput() {
                this.isCommentInputOpen = false;
                this.$nextTick(() => {
                    this.$refs.commInput.value = '';
                    if (!this.isComment) this.commentTxt = '';
                });
            },

            addComment() {
                if (!this.commentTxt.trim()) {
                    this.commentTxt = '';
                    return;
                }
                const comment = {
                    txt: this.commentTxt,
                    createdAt: Date.now(),
                };
                let { taskToEdit, commentTxt, updateTask } = this;
                taskToEdit.comments.unshift(comment);
                commentTxt = '';
                updateTask();
            },

            deleteComment(idx) {
                this.taskToEdit.comments.splice(idx, 1);
                this.updateTask();
            },

            commentTimeToShow(timestamp) {
                return moment(timestamp).calendar();
            },

            showDetails() {
                this.activityListIsShown = !this.activityListIsShown;
                this.showDetailsBtnTxt = this.activityListIsShown ? 'Hide details' : 'Show details';
            },

            chooseMember(member, memberId) {
                let { taskToEdit, isMemberIncluded, updateTask } = this;
                taskToEdit.members = isMemberIncluded(memberId)
                    ? taskToEdit.members.filter((m) => m._id !== memberId)
                    : [...taskToEdit.members, member];
                updateTask();
            },

            isMemberIncluded(memberId) {
                return this.taskToEdit.members.some((m) => m._id === memberId);
            },

            getLbProp(lbId, prop) {
                const label = this.board.labels.find((label) => label.id === lbId);
                return label[prop];
            },

            toggleDate(boolean) {
                this.isDateShown = boolean;
            },

            markAsComplete() {
                this.taskToEdit.isComplete = !this.taskToEdit.isComplete;
                this.updateTask();
            },

            isDate(taskToEdit) {
                if (taskToEdit.dueDate) this.isDateShown = true;
            },

            removeAttachment(idx) {
                this.taskToEdit.attachments.splice(idx, 1);
                this.updateTask();
            },

            toggleAttachCover(idx) {
                let { taskToEdit, setAttachCover } = this;
                if (!taskToEdit.attachments[idx].isCover) {
                    taskToEdit.attachments.forEach((att) => (att.isCover = false));
                    taskToEdit.attachments[idx].isCover = true;
                } else {
                    taskToEdit.attachments[idx].isCover = !taskToEdit.attachments[idx].isCover;
                    if (
                        taskToEdit.coverStyle.bgColor === 'transparent' &&
                        taskToEdit.coverStyle.bgImg === 'none'
                    ) {
                        taskToEdit.attachments[idx].isCover = true;
                    }
                }
                taskToEdit.coverStyle.bgColor = 'transparent';
                setAttachCover();
            },

            setAttachCover() {
                if (this.isAttachCover) {
                    const attach = this.task.attachments.find((attach) => attach.isCover);
                    this.taskToEdit.coverStyle.bgImg = attach.url;
                    this.updateTask();
                }
            },

            editAttachmentTitle(idx) {
                this.taskToEdit.attachments[idx].title = this.newAttachTitle;
                this.updateTask();
                this.newAttachTitle = '';
            },

            removeTaskCover() {
                this.taskToEdit.coverStyle.bgColor = 'transparent';
                this.taskToEdit.coverStyle.bgImg = 'none';
                if (this.isAttachCover) {
                    const idx = this.task.attachments.findIndex((attach) => attach.isCover);
                    this.taskToEdit.attachments[idx].isCover = false;
                }
                this.updateTask();
            },

            saveLoc(location) {
                this.taskToEdit.location = location;
                this.updateTask();
            },

            toggleMap() {
                this.isMapShown = !this.isMapShown;
            },

            removeMap() {
                this.isMapShown = false;
                this.taskToEdit.location = null;
                this.updateTask();
            },

            keepMap(taskToEdit) {
                if (taskToEdit.location) {
                    this.location = taskToEdit.location;
                    this.isMapShown = true;
                }
            },

            addActivity(txt) {
                const board = JSON.parse(JSON.stringify(this.board));
                if (this.loggedInUser) {
                    const activity = {
                        byMember: this.loggedInUser,
                        txt,
                        createdAt: Date.now(),
                    };
                    board.activities.unshift(activity);
                    this.updateBoard(board);
                }
            },

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },

        computed: {
            board() {
                return this.$store.getters.getCurrBoard;
            },

            loggedInUser() {
                return this.$store.getters.loggedinUser;
            },

            isAttachCover() {
                if (this.taskToEdit.attachments.length) {
                    return this.task.attachments.some((attach) => attach.isCover);
                }
            },

            isCoverStyle() {
                const { taskToEdit, isAttachCover } = this;
                return taskToEdit.coverStyle.bgColor === 'transparent' &&
                    taskToEdit.coverStyle.bgImg === 'none'
                    ? isAttachCover
                    : true;
            },
        },

        components: {
            Members,
            Labels,
            Checklist,
            Dates,
            Attachment,
            Location,
            Cover,
            checklistPreview,
            GmapMap,
            avatar,
            moment,
        },
    };
</script>
