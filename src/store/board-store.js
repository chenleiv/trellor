import { boardService } from "@/services/board-service.js"
import { getJSON } from "jquery";

export const boardStore = {
    state: {
        boards: [],
        currBoard: null,
        isLoading: false,
        filterBy: null
    },
    getters: {
        boards({ boards }) {
            console.log('boards', boards);
            return boards
        },
        boardsToShow(state) {
            return state.boards;
        },
        getCurrBoard(state) {
            return state.currBoard
        },
        isLoading({ isLoading }) { return isLoading },
    },
    mutations: {
        setLoading(state, { isLoading }) {
            state.isLoading = isLoading
        },
        getBoard(state, { board }) {
            state.currBoard = board
            console.log('state.currBoard from store getBoard', state.currBoard);
        },
        setBoards(state, { boards }) {
            state.boards = boards;
            console.log('state.boards from store setBoard', state.boards);
        },
        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard)
        },
        updateBoard(state, payload) {
            const idx = state.boards.findIndex(board => board._id === payload.board._id)
            state.boards.splice(idx, 1, payload.board)
            state.currBoard = payload.board
            console.log('state.currBoard MUT updateBoard', state.currBoard);
        },
        // setNewBoard(state, { board }) {
        //     console.log('board', board);
        //     state.currBoard = board
        // },
        removeBoard(state, payload) {
            const idx = state.boards.findIndex(board => board._id === payload.boardId)
            state.boards.splice(idx, 1)
        },
    },
    actions: {
        async loadBoards({ commit, state }) {
            const filterBy = state.filterBy;
            commit({ type: 'setLoading', isLoading: true });
            try {
                const boards = await boardService.query();
                commit({ type: 'setBoards', boards });
            } catch (err) {
                console.log('Error in Query Boards (Store):', err);
                throw err;
            } finally {
                commit({ type: 'setLoading', isLoading: false });
            }
        },
        async getBoard({ commit }, { boardId }) {
            try {
                const board = await boardService.getById(boardId);
                commit({ type: 'getBoard', board });
                return board;
            } catch (err) {
                console.log('Error in Getting a Board (Store):', err);
                throw err;
            }
        },
        async setBoard({ commit }, { boardId }) {
            const board = await boardService.getById(boardId);
            commit({ type: 'setBoard', board })
        },
        async setCurrBoard({ commit }, { boardId }) {
            const board = await boardService.getById(boardId);
            commit({ type: 'setCurrBoard', board })
        },

        async addBoard({ commit }, { board }) {
            try {
                const savedBoard = await boardService.save(board);
                commit({ type: 'addBoard', savedBoard })
                return savedBoard;
            } catch (err) {
                console.log("addBoard (Store):", err);
                throw err;
            }
        },
        async updateBoard({ commit }, { board }) {
            // board.activities.push({name:''});
            try {
                const savedBoard = await boardService.save(board);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },
        async updateBoardTitle({ commit }, { boardId, title }) {
            try {
                // console.log('boardId, title store', boardId, title);
                const savedBoard = await boardService.updateBoard(boardId, title);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },
        async updateBoardBgc({ commit }, { boardId, style }) {
            console.log('boardId store', boardId);
            try {
                // console.log('boardId, title store', boardId, title);
                const savedBoard = await boardService.updateBgcBoard(boardId, style);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },
        async removeBoard({ commit }, { boardId }) {
            try {
                const removedBoardId = await boardService.remove(boardId);
                commit({ type: 'removeBoard', boardId });
                return removedBoardId;
            } catch (err) {
                console.log('removeBoard (Store):', err);
                throw err;
            }
        },
        async updateGroup({ commit }, { boardId, group }) {
            try {
                const savedBoard = await boardService.updateGroup(boardId, group)
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log("updateGroup (Store):", err);
                throw err;
            }
        },
        async removeGroup({ commit }, { boardId, groupId }) {
            try {
                const savedBoard = await boardService.removeGroup(boardId, groupId);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('removeGroup (Store):', err);
                throw err;
            }
        },
        async addGroup({ commit }, { boardId, groupTitle }) {
            try {
                const savedBoard = await boardService.addGroup(boardId, groupTitle);
                commit({ type: 'updateBoard', board: savedBoard })
                console.log('savedBoard', savedBoard);
                return savedBoard;
            } catch (err) {
                console.log("addGroup (Store):", err);
                throw err;
            }
        },
        async addTask({ commit }, { boardId, groupId, taskTitle }) {
            try {
                const savedBoard = await boardService.addTask(boardId, groupId, taskTitle);
                console.log('savedBoard', savedBoard);
                console.log('boardId', boardId);
                commit({ type: 'updateBoard', board: savedBoard, boardId: boardId })
                return savedBoard;
            } catch (err) {
                console.log("addTask Error (Store):", err);
                throw err;
            }
        },

        async updateTask({ commit }, { boardId, groupId, task }) {
            try {
                const savedBoard = await boardService.updateTask(boardId, groupId, task);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log("updateTask Error (Store):", err);
                throw err;
            }
        },

        async removeTask({ commit }, { boardId, groupId, task }) {
            try {
                const savedBoard = await boardService.removeTask(boardId, groupId, task);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('removeGroup (Store):', err);
                throw err;
            }
        },
    }
}