<template>
    <section v-if="task">
        <div class="modal-background" @click.self="backToBoard">
            <section class="task-details-container" @click="cancelEditLabel">
                <template v-if="isCoverStyle">
                    <div
                        :class="{
                            'smaller-cover':
                                taskToEdit.coverStyle.bgImg === 'none',
                        }"
                        class="cover-container"
                        :style="{
                            backgroundColor: taskToEdit.coverStyle.bgColor,
                        }"
                    >
                        <div
                            :class="{
                                'bigger-cover':
                                    taskToEdit.coverStyle.bgColor ===
                                    'transparent',
                            }"
                            class="img-cover-container"
                            :style="{
                                backgroundImage: `url(${taskToEdit.coverStyle.bgImg})`,
                            }"
                        ></div>
                    </div>
                </template>

                <header class="task-modal-header">
                    <button
                        class="close-modal-btn el-icon-close"
                        @click="backToBoard"
                    ></button>
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
                                <div
                                    v-if="task.members.length"
                                    class="members-container"
                                >
                                    <h4
                                        v-if="task.members.length"
                                        class="members-to-show-header"
                                    >
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
                                                    placement="bottom-start"
                                                    :title="member.fullname"
                                                    width="200"
                                                    trigger="click"
                                                    content=""
                                                    class="member-to-show-modal"
                                                >
                                                    <avatar
                                                        class="member-modal-avatar"
                                                        backgroundColor="lightblue"
                                                        color="black"
                                                        :size="30"
                                                        :username="
                                                            member.fullname
                                                        "
                                                    ></avatar>
                                                    <span
                                                        class="remove-member-btn"
                                                        @click="
                                                            chooseMember(
                                                                member,
                                                                member._id
                                                            )
                                                        "
                                                        >Remove from card</span
                                                    >
                                                    <avatar
                                                        slot="reference"
                                                        class="user-avatar"
                                                        backgroundColor="lightblue"
                                                        color="black"
                                                        :size="30"
                                                        :username="
                                                            member.fullname
                                                        "
                                                    ></avatar>
                                                </el-popover>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <div
                                    v-if="task.labelIds.length"
                                    class="labels-container"
                                >
                                    <h4
                                        v-if="task.labelIds.length"
                                        class="labels-to-show-header"
                                    >
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
                                                    'background-color':
                                                        getLbColor(lbId),
                                                }"
                                            >
                                                {{ getLbTitle(lbId) }}
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <div class="date-container" v-if="dateIsShown">
                                    <h3 class="date-to-show-header">
                                        Due date
                                    </h3>
                                    <div class="date-to-show-container">
                                        <div class="date-check-boxes">
                                            <svg
                                                v-if="!taskToEdit.isComplete"
                                                @click="markComplete"
                                                class="date-svg MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pointer css-vubbuv"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                                                ></path>
                                            </svg>
                                            <svg
                                                v-else
                                                @click="markComplete"
                                                class="date-svg MuiSvgIcon-root MuiSvgIcon-fontSizeMedium todo-check pointer css-vubbuv"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div
                                            class="date-to-show-btn secondary-btn"
                                        >
                                            <span class="date-context">{{
                                                taskToEdit.dueDate
                                            }}</span
                                            ><span
                                                v-if="taskToEdit.isComplete"
                                                class="due-msg done"
                                                >complete</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <checklist-preview
                            v-if="isChecklistShown"
                            :checklistTitle="checklistTitle"
                        ></checklist-preview>

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
                                    @blur="updateTask"
                                    @click="openTextArea"
                                    placeholder="Add a more detailed description..."
                                    ref="descriptionInput"
                                    @focus="$event.target.select()"
                                ></textarea>
                                <div
                                    class="description-btns"
                                    v-if="isTextAreaVisible"
                                >
                                    <el-button
                                        type="primary"
                                        class="save-task-description-btn"
                                        @click.prevent="updateTask"
                                    >
                                        <span>Save</span>
                                    </el-button>

                                    <button
                                        class="close-task-description-btn"
                                        @click.prevent="cancelDescAdding"
                                    ></button>
                                </div>
                            </div>
                        </section>

                        <section
                            class="big-features-container"
                            v-if="showBigFeatures"
                        >
                            <div class="attachments-container">
                                <div
                                    v-for="(
                                        attach, i
                                    ) in taskToEdit.attachments"
                                    :key="i"
                                >
                                    <a :href="attach.url" target="_blank">
                                        <span class="attach-title">{{
                                            attach.title
                                        }}</span
                                        ><span
                                            class="external-link-attach"
                                        ></span
                                    ></a>
                                    |
                                    <span
                                        @click="removeAttachment(i)"
                                        class="attach-btns"
                                        >Delete</span
                                    >
                                    |
                                    <el-popover
                                        placement="top"
                                        width="180"
                                        trigger="click"
                                    >
                                        <input
                                            class="titleAttachEdit"
                                            v-model="newAttachTitle"
                                            type="text"
                                        />
                                        <div
                                            style="text-align: right; margin: 0"
                                        >
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="
                                                    editAttachmentTitle(
                                                        attach,
                                                        i
                                                    )
                                                "
                                                >Confirm</el-button
                                            >
                                        </div>
                                        <el-button
                                            class="edit-attach-btn attach-btns"
                                            slot="reference"
                                            @click="
                                                newAttachTitle = attach.title
                                            "
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
                                        @click="attachmentMakeCover(i)"
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
                                    v-if="!loggedInUser"
                                    class="user-avatar"
                                    backgroundColor="lightblue"
                                    color="black"
                                    :size="30"
                                    username="Guest"
                                ></avatar>
                                <avatar
                                    v-if="loggedInUser"
                                    class="user-avatar"
                                    backgroundColor="lightblue"
                                    color="black"
                                    :size="30"
                                    :src="loggedInUser.imgUrl"
                                    :username="loggedInUser.fullname"
                                ></avatar>
                                <textarea
                                    v-model="commentTxt"
                                    type="text"
                                    placeholder="Write a comment..."
                                    @click="openCommentInput"
                                    @blur="closeCommentInput"
                                    @keyup="setCommentInputValue"
                                    ref="commInput"
                                />
                            </div>
                            <button
                                class="save-comment-btn"
                                :class="[visibility, saveCommentBtnStyle]"
                                @click="addComment"
                                :disabled="!commentTxt"
                            >
                                <span>Save</span>
                            </button>

                            <div class="comments-list">
                                <div
                                    v-for="(comment, idx) in task.comments"
                                    :key="idx"
                                    class="activity-preview-container"
                                >
                                    <avatar
                                        v-if="!loggedInUser"
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                        :size="30"
                                        username="Guest"
                                    ></avatar>
                                    <avatar
                                        v-if="loggedInUser"
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                        :size="30"
                                        :src="loggedInUser.imgUrl"
                                        :username="loggedInUser.fullname"
                                    ></avatar>
                                    <div class="activity-details">
                                        <div class="activity-member-container">
                                            <span
                                                class="member-name"
                                                v-if="loggedInUser"
                                                >{{
                                                    loggedInUser.fullname
                                                }}</span
                                            >
                                            <span
                                                class="member-name"
                                                v-if="!loggedInUser"
                                                >Guest</span
                                            >
                                            <span
                                                class="activity-created-at-container"
                                            >
                                                <span
                                                    class="activity-created-at"
                                                    >{{
                                                        commentTimeToShow(
                                                            comment.createdAt
                                                        )
                                                    }}</span
                                                >
                                            </span>
                                        </div>
                                        <div class="comment-content">
                                            {{ comment.txt }}
                                        </div>
                                    </div>
                                    <h5 @click="deleteComment(idx)">Delete</h5>
                                </div>
                            </div>

                            <!-- Need to get the activity from the specific task -->
                            <div
                                class="activity-list"
                                v-if="activityListIsShown"
                            >
                                <div
                                    v-for="activity in board.activities"
                                    :key="activity.id"
                                    class="activity-preview-container"
                                >
                                    <avatar
                                        class="user-avatar"
                                        backgroundColor="lightblue"
                                        color="black"
                                        :size="30"
                                        username="Tal Tarablus"
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
                                        <div
                                            class="activity-created-at-container"
                                        >
                                            <span class="activity-created-at"
                                                >3 days ago</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside>
                        <div class="suggested" v-if="!userJoined">
                            <h4 class="aside-headers">Suggested</h4>
                            <button
                                class="secondary-btn action-btn"
                                @click="joinMember"
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
                            <el-popover
                                v-for="btn in asideBtns"
                                :key="btn.name"
                                class="secondary-btn action-btn"
                                placement="top"
                                :title="btn.name"
                                width="300"
                                trigger="click"
                                content=""
                                :disabled="btn.name === 'Location'"
                            >
                                <hr />
                                <div
                                    v-if="btn.name === 'Members'"
                                    class="member-choosing-container"
                                >
                                    <h4 class="members-to-show-header">
                                        Board members
                                    </h4>
                                    <section
                                        v-for="member in board.members"
                                        :key="member._id"
                                        class="member-choosing"
                                    >
                                        <div
                                            @click="
                                                chooseMember(member, member._id)
                                            "
                                        >
                                            <avatar
                                                class="user-avatar"
                                                backgroundColor="lightblue"
                                                color="black"
                                                :size="30"
                                                :username="member.fullname"
                                            ></avatar>
                                            {{ member.fullname }}
                                            <svg
                                                v-if="
                                                    taskToEdit.members.includes(
                                                        member
                                                    )
                                                "
                                                viewBox="0 0 24 24"
                                                class="delete-member-svg"
                                            >
                                                <path
                                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </section>
                                </div>

                                <div
                                    v-if="btn.name === 'Labels'"
                                    class="label-choosing-container"
                                >
                                    <section
                                        v-for="(label, idx) in labels"
                                        :key="label.id"
                                        class="label-choosing"
                                    >
                                        <div
                                            v-if="!isLabelEdit"
                                            :style="{
                                                'background-color': label.color,
                                            }"
                                            class="label-color"
                                            @click="chooseLabel(label.id)"
                                        >
                                            <svg
                                                v-if="
                                                    taskToEdit.labelIds.includes(
                                                        label.id
                                                    )
                                                "
                                                viewBox="0 0 24 24"
                                                class="delete-label-svg"
                                            >
                                                <path
                                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                                ></path>
                                            </svg>
                                            {{ label.title }}
                                        </div>
                                        <button
                                            v-if="!isLabelEdit"
                                            class="label-pencil"
                                            @click="
                                                editLabelTitle(label.id, idx)
                                            "
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path
                                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                                ></path>
                                            </svg>
                                        </button>
                                    </section>
                                    <div
                                        v-if="isLabelEdit"
                                        class="edit-label-container"
                                    >
                                        <label for="labelTitle">Name</label>
                                        <el-input
                                            name="labelTitle"
                                            v-model="labelTitle"
                                            class="labelTitleInput"
                                        ></el-input>
                                        <div class="edit-label-buttons">
                                            <el-button
                                                type="primary"
                                                class="save"
                                                @click="saveLabelTitle"
                                                >Save</el-button
                                            >
                                            <el-button
                                                type="danger"
                                                class="delete"
                                                @click="removeLabel"
                                                >Delete</el-button
                                            >
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-if="btn.name === 'Checklist'"
                                    class="add-checklist-container"
                                >
                                    <h3 class="add-checklist-header">Title</h3>
                                    <el-input
                                        placeholder="Enter a title..."
                                        v-model="checklistTitle"
                                    ></el-input>
                                    <el-button
                                        type="primary"
                                        class="add-checklist-btn"
                                        @click="addCheckList"
                                        >Add</el-button
                                    >
                                </div>
                                <!-- @click="addChecklist" -->

                                <div
                                    v-if="btn.name === 'Dates'"
                                    class="date-picking-container"
                                >
                                    <el-date-picker
                                        v-model="dateVal"
                                        type="date"
                                        placeholder="Pick a day"
                                    >
                                    </el-date-picker>
                                    <div class="edit-date-buttons">
                                        <el-button
                                            type="primary"
                                            class="save-date-btn"
                                            @click="saveDate"
                                            >Save</el-button
                                        >
                                        <el-button
                                            type="info"
                                            class="delete-date-btn"
                                            @click="removeDate"
                                            plain
                                            >Remove</el-button
                                        >
                                    </div>
                                </div>

                                <div
                                    v-if="btn.name === 'Attachment'"
                                    class="attach-popover"
                                >
                                    <img-upload
                                        @onSaveImg="changeImgUrl"
                                    ></img-upload>
                                </div>

                                <div
                                    v-if="btn.name === 'Location'"
                                    class="location-search-container"
                                ></div>

                                <div v-if="btn.name === 'Cover'">
                                    <div @click="removeTaskCover">
                                        Remove cover
                                    </div>
                                    Colors
                                    <background-picker
                                        @chosenBg="chosenBg"
                                        :withImgBg="withImgBg"
                                    ></background-picker>
                                    Images
                                    <background-unsplash
                                        @onSaveImg="onSaveImgCover"
                                    ></background-unsplash>
                                </div>
                                <div
                                    class="action-btn-content"
                                    slot="reference"
                                    @click="showMap(btn.name)"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path :d="btn.d"></path>
                                        <path
                                            v-if="btn.name === 'Dates'"
                                            d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                                        ></path>
                                    </svg>
                                    <span>{{ btn.name }}</span>
                                </div>
                            </el-popover>
                        </div>
                    </aside>
                </section>
            </section>
        </div>
    </section>
</template>

<script>
    import avatar from 'vue-avatar';
    import imgUpload from '@/cmps/img-upload';
    import GmapMap from '@/cmps/task-map';
    import backgroundPicker from '@/cmps/background-picker';
    import backgroundUnsplash from '@/cmps/background-unsplash';
    import checklistPreview from '../cmps/checklist-preview';
    import moment from 'moment';

    export default {
        name: 'taskDetails',

        data() {
            return {
                location: {
                    coords: { lat: 31.769218, lng: 35.208144 },
                    address: 'Jerusalem',
                },

                task: null,
                group: null,
                taskToEdit: {},
                taskTitle: '',
                isTextAreaVisible: false,
                description: '',
                isCommentInputOpen: false,
                isCommentInput: '',
                commentTxt: '',
                showDetailsBtnTxt: 'Show details',
                activityListIsShown: false,
                asideBtns: [
                    {
                        name: 'Members',
                        d: 'M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4zm-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4zm2 0c.2-.71 3.3-2 6-2 2.69 0 5.78 1.28 6 2H3zm17-3v-3h3v-2h-3V7h-2v3h-3v2h3v3h2z',
                    },
                    {
                        name: 'Labels',
                        d: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z',
                    },
                    {
                        name: 'Dates',
                        d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
                    },
                    {
                        name: 'Checklist',
                        d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z',
                    },
                    {
                        name: 'Attachment',
                        d: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
                    },
                    {
                        name: 'Location',
                        d: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
                    },
                    {
                        name: 'Cover',
                        d: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z',
                    },
                ],
                userJoined: false,
                labels: [],
                hasLabelChosen: false,
                labelIdToShow: '',
                labelIdsToShow: [],
                isLabelEdit: false,
                labelTitle: '',
                labelIdxToEdit: null,
                labelIdToEdit: null,
                membersToShow: [],
                isBigFeatureShown: false,
                withImgBg: false,
                newAttachTitle: '',
                isChecklistShown: false,
                checklistTitle: '',
                dateIsShown: false,
                dateVal: '',
                cover: '',
                isMapShown: false,
            };
        },

        created() {
            this.loadData();
        },

        methods: {
            async loadData() {
                const board = this.board;
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
                    const group = board.groups.find((gr) =>
                        gr.tasks.includes(this.task)
                    );
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
                    console.log(
                        `Task Succefully Updated with Id ${this.task.id}`
                    );
                } catch (err) {
                    console.log('Error in updateTask (task-details):', err);
                    throw err;
                } finally {
                    this.$refs.commInput.value = '';
                    this.commentTxt = '';
                }
            },

            saveLoc(location) {
                this.taskToEdit.location = location;
                this.updateTask();
            },

            keepMap(taskToEdit) {
                if (taskToEdit.location) {
                    this.location = taskToEdit.location;
                    this.isMapShown = true;
                }
            },

            removeMap() {
                this.isMapShown = false;
                this.taskToEdit.location = null;
                this.updateTask();
            },

            showMap(btnName) {
                if (btnName === 'Location') this.isMapShown = true;
            },

            async updateBoard(board) {
                try {
                    await this.$store.dispatch({
                        type: 'updateBoard',
                        board,
                    });
                    this.board = savedBoard;
                    console.log(`Board updated successfully`);
                    this.labelTitle = '';
                } catch (err) {
                    console.log('Error in updateBoard (task-details):', err);
                    throw err;
                }
            },

            openTextArea() {
                this.isTextAreaVisible = true;
            },

            cancelDescAdding() {
                this.description = '';
                this.isTextAreaVisible = false;
            },

            openCommentInput() {
                this.isCommentInputOpen = true;
            },

            closeCommentInput() {
                this.isCommentInputOpen = false;
                this.$nextTick(() => {
                    this.$refs.commInput.value = '';
                    if (!this.isCommentInput) this.commentTxt = '';
                });
            },

            setCommentInputValue(ev) {
                this.isCommentInput = ev.target.value ? true : false;
            },

            addComment() {
                if (!this.commentTxt.trim()) {
                    this.isCommentInput = '';
                    this.commentTxt = '';
                    return;
                }
                const comment = {
                    txt: this.commentTxt,
                    createdAt: Date.now(),
                };

                // this.commentTime = moment(comment.time).calendar();

                this.taskToEdit.comments.unshift(comment);
                this.commentTxt = '';
                this.updateTask();
            },

            deleteComment(idx) {
                // this.commentIdx = idx;
                this.taskToEdit.comments.splice(idx, 1);
                this.updateTask();
            },

            commentTimeToShow(timestamp) {
                return moment(timestamp).calendar();
            },

            showDetails() {
                this.activityListIsShown = !this.activityListIsShown;
                this.showDetailsBtnTxt = this.activityListIsShown
                    ? 'Hide details'
                    : 'Show details';
            },

            joinMember() {
                this.userJoined = true;
                // if (this.taskToEdit.members.length) {
                this.chooseMember(
                    this.board.members[0],
                    this.board.members[0]._id
                );
                // }
                // Next it will be the loggedIn User
            },

            chooseMember(member, memberId) {
                // this.membersToShow.push(member);
                const memberIdx = this.taskToEdit.members.findIndex(
                    (m) => m._id === memberId
                );
                if (this.taskToEdit.members.includes(member)) {
                    this.taskToEdit.members.splice(memberIdx, 1);
                    if (member === this.board.members[0]) {
                        this.userJoined = false;
                    }
                } else {
                    this.taskToEdit.members.push(member);
                    if (member === this.board.members[0]) {
                        this.userJoined = true;
                    }
                }
                // this.taskToEdit['activities'] = [
                //     {
                //         name: this.loggedInUser.fullname,
                //         txt: ` has added ${member}`,
                //     },
                // ];
                this.updateTask();
            },

            getLbColor(lbId) {
                const label = this.board.labels.find(
                    (label) => label.id === lbId
                );
                return label.color;
            },
            getLbTitle(lbId) {
                const label = this.board.labels.find(
                    (label) => label.id === lbId
                );
                return label.title;
            },

            chooseLabel(id) {
                this.hasLabelChosen = true;

                this.labelIdToShow = id;

                const labelIdx = this.taskToEdit.labelIds.findIndex(
                    (lbId) => lbId === id
                );
                if (this.taskToEdit.labelIds.includes(id)) {
                    this.taskToEdit.labelIds.splice(labelIdx, 1);
                } else {
                    this.taskToEdit.labelIds.push(id);
                }

                this.updateTask();
            },

            editLabelTitle(labelId, idx) {
                this.isLabelEdit = true;
                this.labelIdxToEdit = idx;
                this.labelIdToEdit = labelId;
            },

            saveLabelTitle() {
                this.isLabelEdit = false;
                this.labels[this.labelIdxToEdit].title = this.labelTitle;
                const board = JSON.parse(JSON.stringify(this.board));
                board.labels = this.labels;
                this.updateBoard(board);
                this.labelTitle = '';
            },

            removeLabel() {
                this.isLabelEdit = false;
                const lbIdx = this.taskToEdit.labelIds.findIndex(
                    (id) => id === this.labelIdToEdit
                );
                this.taskToEdit.labelIds.splice(lbIdx, 1);
                this.labels[this.labelIdxToEdit].title = '';
                const board = JSON.parse(JSON.stringify(this.board));
                board.labels = this.labels;
                this.updateTask();
                this.updateBoard(board);
            },

            cancelEditLabel() {
                setTimeout(() => {
                    this.isLabelEdit = false;
                }, 500);
            },

            saveDate() {
                this.dateIsShown = true;
                const dateStr = this.dateVal.toString();
                const dateToSave = dateStr.substring(4, 15);
                this.taskToEdit.dueDate = dateToSave;
                this.updateTask();
            },

            removeDate() {
                console.log('removeDate');
                this.dateIsShown = false;
                this.taskToEdit.dueDate = '';
                this.taskToEdit.isComplete = false;
                this.updateTask();
            },

            markComplete() {
                this.taskToEdit.isComplete = !this.taskToEdit.isComplete;
                this.updateTask();
            },

            isDate(taskToEdit) {
                if (taskToEdit.dueDate) this.dateIsShown = true;
            },

            changeImgUrl(url) {
                let title = /[^/]*$/.exec(url)[0];
                this.taskToEdit.attachments.push({
                    title,
                    url,
                    isCover: false,
                });
                if (
                    this.taskToEdit.attachments.length === 1 &&
                    this.taskToEdit.coverStyle.bgColor !== 'transparent' &&
                    this.taskToEdit.coverStyle.bgImg !== 'none'
                )
                    this.taskToEdit.attachments[0].isCover = true;
                this.updateTask();
                this.cover = url;
            },

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
            removeAttachment(idx) {
                this.taskToEdit.attachments.splice(idx, 1);
                this.updateTask();
            },
            attachmentMakeCover(idx) {
                if (!this.taskToEdit.attachments[idx].isCover) {
                    for (
                        let i = 0;
                        i < this.taskToEdit.attachments.length;
                        i++
                    ) {
                        this.taskToEdit.attachments[i].isCover = false;
                    }
                    this.taskToEdit.attachments[idx].isCover = true;
                } else {
                    this.taskToEdit.attachments[idx].isCover =
                        !this.taskToEdit.attachments[idx].isCover;
                    if (
                        this.taskToEdit.coverStyle.bgColor === 'transparent' &&
                        this.taskToEdit.coverStyle.bgImg === 'none'
                    )
                        this.taskToEdit.attachments[idx].isCover = true;
                }

                this.taskToEdit.coverStyle.bgColor = 'transparent';
                this.attachCover();
            },
            attachCover() {
                if (this.isAttachCover) {
                    const attach = this.task.attachments.find(
                        (attach) => attach.isCover
                    );
                    this.taskToEdit.coverStyle.bgImg = attach.url;
                    this.updateTask();
                }
            },
            editAttachmentTitle(attach, idx) {
                this.taskToEdit.attachments[idx].title = this.newAttachTitle;
                this.updateTask();
                this.newAttachTitle = '';
            },
            onSaveImgCover(url) {
                this.taskToEdit.coverStyle.bgColor = 'transparent';
                this.taskToEdit.coverStyle.bgImg = url;
                if (this.isAttachCover) {
                    const idx = this.task.attachments.findIndex(
                        (attach) => attach.isCover
                    );
                    this.taskToEdit.attachments[idx].isCover = false;
                }
                this.updateTask();
                // this.isCoverStyle = true;
            },
            chosenBg(style) {
                this.taskToEdit.coverStyle.bgColor = style.bgColor;
                this.taskToEdit.coverStyle.bgImg = 'none';
                if (this.isAttachCover) {
                    const idx = this.task.attachments.findIndex(
                        (attach) => attach.isCover
                    );
                    this.taskToEdit.attachments[idx].isCover = false;
                }

                this.updateTask();

                // this.isCoverStyle = true;
            },
            removeTaskCover() {
                this.taskToEdit.coverStyle.bgColor = 'transparent';
                this.taskToEdit.coverStyle.bgImg = 'none';
                if (this.isAttachCover) {
                    const idx = this.task.attachments.findIndex(
                        (attach) => attach.isCover
                    );
                    this.taskToEdit.attachments[idx].isCover = false;
                }
                this.updateTask();
            },
            addCheckList() {
                this.isChecklistShown = true;
            },
        },

        computed: {
            loggedInUser() {
                return this.$store.getters.loggedinUser;
            },
            board() {
                return this.$store.getters.getCurrBoard;
            },

            visibility() {
                return { hidden: !this.isCommentInputOpen };
            },

            saveCommentBtnStyle() {
                return { 'save-comment-btn-typing-style': this.isCommentInput };
            },
            showBigFeatures() {
                if (this.isMapShown || this.taskToEdit.attachments.length > 0)
                    return true;
                else return false;
            },
            isAttachCover() {
                if (this.taskToEdit.attachments.length > 0) {
                    return this.task.attachments.some(
                        (attach) => attach.isCover
                    );
                }
            },

            isCoverStyle() {
                if (
                    this.taskToEdit.coverStyle.bgColor === 'transparent' &&
                    this.taskToEdit.coverStyle.bgImg === 'none'
                ) {
                    if (this.isAttachCover) return true;
                    else return false;
                } else return true;
            },
        },

        components: {
            avatar,
            imgUpload,
            GmapMap,
            backgroundPicker,
            backgroundUnsplash,
            checklistPreview,
            moment,
        },
    };
</script>
