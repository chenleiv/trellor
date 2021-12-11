// import { storageService } from "./async-storage.service.js"
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED } from './socket.service'


export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyGroup,
    addGroup,
    updateGroup,
    removeGroup,
    getEmptyTask,
    addTask,
    updateTask,
    updateBoardTitle,
    updateBgcBoard,
    removeTask
}

// const BOARD_KEY = 'boardsDB'
const BOARD_URL = 'http://localhost:3030/api/board/'

// _createBoards()

async function query() {
    try {
        // const res = await axios.get(BOARD_URL, { params: filterBy })
        // return res.data
        return httpService.get(`board`)
        //(`board`,filterBy)
    } catch (err) {
        console.log('Error in Query board (Front board Service):', err);
        throw err;
    }
    // return await storageService.query(BOARD_KEY)
}
async function getById(boardId) {
    // return await storageService.get(BOARD_KEY, boardId)
    const res = await httpService.get(`board/${boardId}`)
    return res;
}

async function remove(boardId) {
    // return await storageService.remove(BOARD_KEY, boardId)
    return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    try {
        if (board._id) {
            // console.log('board._id', board._id);
            // console.log('PUT (save)');
            httpService.put('board', board)
            return board
        } else {
            console.log('POST (save)');
            return httpService.post('board', board)
        }
    } catch (err) {
        console.log('Saving Error (Front board Service):', err);
        throw err;
    }
    // const savedBoard = (board._id) ? await storageService.put(BOARD_KEY, board) : await storageService.post(BOARD_KEY, board)
    // return savedBoard;
}

function getEmptyGroup() {
    return {
        id: utilService.makeId(),
        title: '',
        tasks: []
    }
}

function getEmptyTask() {
    return {
        id: utilService.makeId(),
        title: '',
        description: '',
        comments: [],
        attachments: [],
        checklists: [],
        members: [],
        labelIds: [],
        createdAt: '',
        dueDate: '',
        byMember: {},
        coverStyle: { bgColor: 'transparent', bgImg: 'none' },
        location: null,
        isComplete: false
    }
}

async function addTask(boardId, groupId, title) {
    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(g => g.id === groupId)
        const newTask = getEmptyTask();
        newTask.title = title;
        board.groups[groupIdx].tasks.push(newTask);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in addTask (board-service):', err);
        throw err;
    }
}

async function removeTask(boardId, groupId, task) {
    try {
        const board = await getById(boardId);
        const group = board.groups.find(g => g.id === groupId)
        const taskIdx = group.tasks.findIndex(t => t.id === task.id)
        group.tasks.splice(taskIdx, 1);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in removeTask (board-service):', err);
        throw err;
    }
}


async function updateTask(boardId, groupId, task) {
    try {
        const board = await getById(boardId);
        // console.log('boardId', boardId);
        const group = board.groups.find(g => g.id === groupId)
        // console.log('group', group);
        const taskIdx = group.tasks.findIndex(t => t.id === task.id)
        // console.log('taskIdx', taskIdx);
        group.tasks.splice(taskIdx, 1, task);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in updateTask (board-service):', err);
        throw err;
    }
}

async function addGroup(boardId, title) {
    try {
        const board = await getById(boardId);
        const newGroup = getEmptyGroup();
        newGroup.title = title;
        board.groups.push(newGroup);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in addGroup (board-service):', err);
        throw err;
    }
}

async function updateBoardTitle(boardId, title) {
    // console.log('boardId', boardId);
    try {
        const board = await getById(boardId);
        // console.log('board', board);
        // console.log('board', boardId);
        board.title = title;
        // console.log('board', board);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in updateBoard (board-service):', err);
        throw err;
    }
}
async function updateBgcBoard(boardId, style) {
    // console.log('style', style);
    // console.log('boardId', boardId);
    try {
        const board = await getById(boardId);
        // console.log('board from service', board);
        board.style = style
        save(board);
        return board;
    } catch (err) {
        console.log('Error in updateBoard (board-service):', err);
        throw err;
    }
}

async function updateGroup(boardId, newGroup) {
    try {
        const board = await getById(boardId);
        const idx = board.groups.findIndex(group => group.id === newGroup.id);
        board.groups.splice(idx, 1, newGroup);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in updateGroup (board-service):', err);
        throw err;
    }
}

async function removeGroup(boardId, groupId) {
    try {
        const board = await getById(boardId);
        const idx = board.groups.findIndex(group => group.id === groupId);
        board.groups.splice(idx, 1);
        save(board);
        return board;
    } catch (err) {
        console.log('Error in removeGroup (board-service):', err);
        throw err;
    }
}

// function _createBoards() {
//     var boards = JSON.parse(localStorage.getItem(BOARD_KEY))
//     if (!boards || !boards.length) {
//         boards = [
//             _createBoard(),
//         ]
//         localStorage.setItem(BOARD_KEY, JSON.stringify(boards))
//     }
//     return boards;
// }

function getEmptyBoard() {
    return {
        title: '',
        createdAt: '',
        createdBy: {
            _id: '',
            fullname: '',
            imgUrl: ''
        },
        style: { bgColor: '', bgImg: '' },
        labels: [{
            id: 'l101',
            title: '',
            color: '#409EFF'
        },
        {
            id: 'l102',
            title: '',
            color: '#67C23A'
        },
        {
            id: 'l103',
            title: '',
            color: '#E6A23C'
        },
        {
            id: 'l104',
            title: '',
            color: '#F56C6C'
        },
        ],
        members: [{
            _id: '',
            fullname: '',
            imgUrl: ''
        }],
        groups: [{
            id: utilService.makeId(4) + 's',
            title: 'To do',
            tasks: [{
                id: utilService.makeId(4) + 'j',
                title: 'Do that',
                description: '',
                comments: [],
                attachments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { bgColor: 'transparent', bgImg: 'none' },
                location: null,
                isComplete: false
            },]
        }, {
            id: utilService.makeId(4) + 'f',
            title: 'Doing',
            tasks: [{
                id: utilService.makeId(4) + 5,
                title: 'Do that',
                description: '',
                comments: [],
                attachments: [],
                checklists: [],
                members: [],
                labelIds: [],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { bgColor: 'transparent', bgImg: 'none' },
                location: null,
                isComplete: false
            },]
        },
        {
            id: utilService.makeId(),
            title: 'Done',
            tasks: [{
                id: utilService.makeId(),
                title: 'Do that',
                description: '',
                comments: [],
                attachments: [],
                checklists: [],
                members: [],
                labelIds: [],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { bgColor: 'transparent', bgImg: 'none' },
                location: null,
                isComplete: false
            },]
        }
        ],
        activities: [],
        isStarred: false
    }
}

// function _createBoard() {
//     return {
//         _id: 'b101',
//         title: 'Demo Board',
//         createdAt: 1638284394000,
//         createdBy: {
//             _id: 'u101',
//             fullname: 'Ben Ernst',
//             imgUrl: ''
//         },
//         style: { bgColor: '#afafaf', bgImg: 'none' },
//         labels: [{
//             id: 'l101',
//             title: '',
//             color: '#409EFF'
//         }, {
//             id: 'l102',
//             title: '',
//             color: '#67C23A'
//         }, {
//             id: 'l103',
//             title: '',
//             color: '#E6A23C'
//         }, {
//             id: 'l104',
//             title: '',
//             color: '#F56C6C'
//         }],
//         members: [{
//             _id: 'u101',
//             fullname: 'Ben Ernst',
//             imgUrl: ''
//         },
//         {
//             _id: 'u102',
//             fullname: 'Or Baadani',
//             imgUrl: ''
//         },
//         {
//             _id: 'u103',
//             fullname: 'Chen leiv',
//             imgUrl: ''
//         }
//         ],
//         groups: [{
//             id: 'g101', //1
//             title: 'General',
//             tasks: [{
//                 id: 't101',
//                 title: 'Meeting with Asi, scss',
//                 description: 'Tuesday, 15:45',
//                 comments: ['preparing qeustions'],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Or',
//                     fullname: 'Or Baadani',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },]
//         },
//         {
//             id: 'g102', //2
//             title: 'Backlog client',
//             tasks: [{
//                 id: 't102',
//                 title: 'Task-Labels',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u101',
//                     username: 'Ben',
//                     fullname: 'Ben Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't103',
//                 title: 'Filter Cmp',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u101',
//                     username: 'Ben',
//                     fullname: 'Ben Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             ]
//         },
//         {
//             id: 'g103', //3
//             title: 'Backlog - server',
//             tasks: [{
//                 id: 't104',
//                 title: 'Build Mongo Atlas DB',
//                 description: 'dsdsds',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't105',
//                 title: 'Connecting Backend & Frontend',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             ],
//         },
//         {
//             id: 'g104',
//             title: 'In development',
//             tasks: [{
//                 id: 't106',
//                 title: 'Drag and Drop',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't107',
//                 title: 'Board Header',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't108',
//                 title: 'Task-Details (modal)',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u101',
//                     username: 'Ben',
//                     fullname: 'Bem Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't109',
//                 title: 'Aside Menu',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Or',
//                     fullname: 'Or Baadani',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't110',
//                 title: 'Workspace Page',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Or',
//                     fullname: 'Or Baadani',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't111',
//                 title: 'Home Page',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u101',
//                     username: 'Ben',
//                     fullname: 'Ben Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't112',
//                 title: 'Main Header',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Or',
//                     fullname: 'Or Baadani',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't113',
//                 title: 'Group-Preview cmp',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen Leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't114',
//                 title: 'Task-Preview cmp',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Ben',
//                     fullname: 'Ben Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             ]
//         },
//         {
//             id: 'g105',
//             title: 'Done',
//             tasks: [{
//                 id: 't115',
//                 title: 'Building Main Structure',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u102',
//                     username: 'Or',
//                     fullname: 'Or Baadani',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't116',
//                 title: 'Creating Demo Data Model',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u103',
//                     username: 'Chen',
//                     fullname: 'Chen leiv',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             {
//                 id: 't117',
//                 title: 'Connecting to GitHub Pages',
//                 description: '',
//                 comments: [],
//                 attachments: [],
//                 checklists: [],
//                 members: [],
//                 labelIds: [],
//                 createdAt: '',
//                 dueDate: '',
//                 byMember: {
//                     _id: 'u101',
//                     username: 'Ben',
//                     fullname: 'Bem Ernst',
//                     imgUrl: ''
//                 },
//                 coverStyle: { 'color': '#26de81' },
//                 location: null,
//                 isComplete: false
//             },
//             ]
//         },
//         ],
//         activities: [{
//             id: 'a101',
//             txt: 'Changed Color',
//             createdAt: 154514,
//             byMember: {
//                 _id: 'u101',
//                 fullname: 'Ben Ernst',
//                 imgUrl: ''
//             },
//             coverStyle: { 'color': '#26de81' }
//         },
//         {
//             id: 'a102',
//             txt: 'Added a task',
//             createdAt: 154516,
//             byMember: {
//                 _id: 'u102',
//                 fullname: 'Or Baadani',
//                 imgUrl: ''
//             },
//             coverStyle: { 'color': '#26de81' }
//         },
//         {
//             id: 'a103',
//             txt: 'Changed Status',
//             createdAt: 154520,
//             byMember: {
//                 _id: 'u103',
//                 fullname: 'Chen Leiv',
//                 imgUrl: ''
//             },
//             coverStyle: { 'color': '#26de81' }
//         }
//         ],

//         isStarred: false,
//     }
// }