import { storageService } from "./async-storage.service.js"
import { utilService } from './util.service.js'

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
    updateBoard,
    updateBgcBoard
}

const BOARD_KEY = 'boardsDB'

_createBoards()

async function query() {
    return await storageService.query(BOARD_KEY)
    // return httpService.get(`board`, filterBy)
}
async function getById(boardId) {
    return await storageService.get(BOARD_KEY, boardId)
    // const res = await httpService.get(`board/${boardId}`)
    // return res;
}

async function remove(boardId) {
    return await storageService.remove(BOARD_KEY, boardId)
    // return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    const savedBoard = (board._id) ? await storageService.put(BOARD_KEY, board) : await storageService.post(BOARD_KEY, board)
    return savedBoard;
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
        checklists: [],
        members: [],
        labelIds: [],
        createdAt: '',
        dueDate: '',
        byMember: {},
        coverStyle: { 'color': '' }
    }
}

async function addTask(boardId, groupId, title) {
    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(g => g.id === groupId)
        const newTask = getEmptyTask();
        newTask.title = title;
        board.groups[groupIdx].tasks.push(newTask);
        return save(board);
    } catch (err) {
        console.log('Error in addTask (board-service):', err);
        throw err;
    }

}

async function updateTask(boardId, groupId, task, title = task.title, description = task.description, comment = '', commentIdx = null) {
    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(g => g.id === groupId)
        const taskIdx = board.groups[groupIdx].tasks.findIndex(t => t === task)
        task.title = title;
        task.description = description;
        if (comment) task.comments.push(comment);
        console.log('commentIdx:', commentIdx);
        if (commentIdx !== null) task.comments.splice(commentIdx, 1);
        board.groups[groupIdx].tasks.splice(taskIdx, 1, task);
        return save(board);
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
        return save(board);
    } catch (err) {
        console.log('Error in addGroup (board-service):', err);
        throw err;
    }
}

async function updateBoard(boardId, title) {

    try {
        const board = await getById(boardId);
        board.title = title;
        return save(board);
    } catch (err) {
        console.log('Error in updateBoard (board-service):', err);
        throw err;
    }
}
async function updateBgcBoard(boardId, style) {
    console.log('style', style);
    console.log('boardId', boardId);
    try {
        const board = await getById(boardId);
        // console.log('board from service', board);
        board.style = style
        return save(board);
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
        return save(board);
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
        return save(board);
    } catch (err) {
        console.log('Error in removeGroup (board-service):', err);
        throw err;
    }
}

function _createBoards() {
    var boards = JSON.parse(localStorage.getItem(BOARD_KEY))
    if (!boards || !boards.length) {
        boards = [
            _createBoard(),
        ]
        localStorage.setItem(BOARD_KEY, JSON.stringify(boards))
    }
    return boards;
}

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
            color: '#61bd4f'
        },
        {
            id: 'l102',
            title: '',
            color: '#61bd4f'
        },
        {
            id: 'l103',
            title: '',
            color: '#61bd4f'
        }
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
                checklists: [],
                members: [],
                labelIds: [],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { 'color': '#26de81' }
            },]
        }, {
            id: utilService.makeId(4) + 'f',
            title: 'Doing',
            tasks: [{
                id: utilService.makeId(4) + 5,
                title: 'Do that',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: [],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { 'color': '#26de81' }
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
                checklists: [],
                members: [],
                labelIds: [],
                createdAt: '',
                dueDate: '',
                byMember: {},
                coverStyle: { 'color': '#26de81' }
            },]
        }
        ],
        activities: [],
        isStarred: false
    }
}

function _createBoard() {
    return {
        _id: 'b101',
        title: 'Demo Board',
        createdAt: 1638284394000,
        createdBy: {
            _id: 'u101',
            fullname: 'Ben Ernst',
            imgUrl: ''
        },
        style: { bgColor: '#afafaf', bgImg: 'none' },
        labels: [{
            id: 'l101',
            title: 'This month',
            color: '#409EFF'
        },{
            id: 'l102',
            title: 'This two weeks',
            color: '#67C23A'
        },{
            id: 'l103',
            title: 'This week',
            color: '#E6A23C'
        },{
            id: 'l104',
            title: 'Today',
            color: '#F56C6C'
        }],
        members: [{
            _id: 'u101',
            fullname: 'Ben Ernst',
            imgUrl: ''
        },
        {
            _id: 'u102',
            fullname: 'Or Baadani',
            imgUrl: ''
        },
        {
            _id: 'u103',
            fullname: 'Chen leiv',
            imgUrl: ''
        }
        ],
        groups: [{
            id: 'g101',
            title: 'General',
            tasks: [{
                id: 't101',
                title: 'Meeting with Asi, scss',
                description: 'Tuesday, 15:45',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Or',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },]
        },
        {
            id: 'g102',
            title: 'Backlog client',
            tasks: [{
                id: 't103',
                title: 'task-labels',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Ben',
                    fullname: 'Ben Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't104',
                title: 'filter cmp',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Ben',
                    fullname: 'Ben Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            ]
        },
        {
            id: 'g103',
            title: 'Backlog - server',
            tasks: [{
                id: 't105',
                title: 'Build Mongo Atlas DB',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't106',
                title: 'Connecting Backend & Frontend',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            ]
        },
        {
            id: 'g104',
            title: 'In development',
            tasks: [{
                id: 't107',
                title: 'drag and drop',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't108',
                title: 'board header',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't109',
                title: 'task-details (modal)',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Ben',
                    fullname: 'Bem Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't110',
                title: 'aside menu',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Or',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't111',
                title: 'workspace page',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Or',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't112',
                title: 'home page',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Ben',
                    fullname: 'Ben Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't113',
                title: 'main header',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Or',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't114',
                title: 'group-preview cpm',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen Leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't115',
                title: 'task-preview cmp',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Ben',
                    fullname: 'Ben Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            ]
        },
        {
            id: 'g105',
            title: 'Done',
            tasks: [{
                id: 't116',
                title: 'Building Main Structure',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u102',
                    username: 'Or',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't117',
                title: 'Creating Demo Data Model',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u103',
                    username: 'Chen',
                    fullname: 'Chen leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 't118',
                title: 'Connecting to GitHub Pages',
                description: '',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Ben',
                    fullname: 'Bem Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            ]
        },
        ],
        activities: [
            {
                id: 'a101',
                txt: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Ben Ernst',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 'a102',
                txt: 'Added a task',
                createdAt: 154516,
                byMember: {
                    _id: 'u102',
                    fullname: 'Or Baadani',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            },
            {
                id: 'a103',
                txt: 'Changed Status',
                createdAt: 154520,
                byMember: {
                    _id: 'u103',
                    fullname: 'Chen Leiv',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            }
        ],
        isStarred: false,
    }
}