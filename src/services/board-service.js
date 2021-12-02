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
    addTask
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
                id: utilService.makeId(),
                title: 'To do',
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
                }, ]
            }, {
                id: utilService.makeId(),
                title: 'Doing',
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
                }, ]
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
                }, ]
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
        style: { bgColor: '#2d2d2d', bgImg: '' },
        labels: [{
            id: 'l101',
            title: 'Done',
            color: '#61bd4f'
        }],
        members: [{
                _id: 'u101',
                fullname: 'Ben Ernst',
                imgUrl: ''
            },
            {
                _id: 'u102',
                fullname: 'Tal Tarablus',
                imgUrl: ''
            }
        ],
        groups: [{
            id: 'g101',
            title: 'Group 1',
            tasks: [{
                id: 't101',
                title: 'Do that',
                description: 'some description',
                comments: [],
                checklists: [],
                members: [],
                labelIds: ['l101'],
                createdAt: '',
                dueDate: '',
                byMember: {
                    _id: 'u101',
                    username: 'Tal',
                    fullname: 'Tal Tarablus',
                    imgUrl: ''
                },
                coverStyle: { 'color': '#26de81' }
            }, ]
        }],
        activities: [{
            id: 'a101',
            txt: 'Changed Color',
            createdAt: 154514,
            byMember: {
                _id: 'u102',
                fullname: 'Tal Tarablus',
                imgUrl: ''
            },
            task: {
                id: 't101',
                title: 'Do that'
            }
        }],
        isStarred: false,
    }
}