import { boardService } from "@/services/board-service.js"

export const boardStore = {
    state: {
        boards: [],
        currBoard: null,
        isLoading: false,
    },
    getters: {
        boards({ boards }) { return boards },
        boardsToShow(state) {
            // var boards = JSON.parse(JSON.stringify(state.boards));

            return state.boards;
        },
        getCurrBoard(state) { return state.currBoard },
        isLoading({ isLoading }) { return isLoading },
    },
    mutations: {
        setLoading(state, { isLoading }) {
            state.isLoading = isLoading
        },
        getBoard(state, { board }) {
            state.currBoard = board
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        setBoard(state, {board}) {
            state.currBoard = board
        },
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard)
        },
        updateBoard(state, payload) {
            const idx = state.boards.findIndex(board => board._id === payload.board._id)
            state.boards.splice(idx, 1, payload.board)
            state.currBoard = payload.board
        },
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
                const boards = await boardService.query(filterBy);
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
        async setBoard({commit}, {boardId}) {
            const board = await boardService.getById(boardId);
            commit({type: 'setBoard', board})
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
                return savedBoard;
            } catch {
                console.log("addGroup (Store):", err);
                throw err;
            }
        },
        async addTask({ commit }, { boardId, groupId, taskTitle }) {
            try {
                const savedBoard = await boardService.addTask(boardId, groupId, taskTitle);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch {
                console.log("addTask Error (Store):", err);
                throw err;
            }
        },
        // , taskTitle, taskDescription, comment, commentIdx, labelId, members
        async updateTask({ commit }, { boardId, groupId, task }) {
            try {
                // , taskTitle, taskDescription, comment, commentIdx, labelId, members
                console.log('task:', task);
                const savedBoard = await boardService.updateTask(boardId, groupId, task);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch {
                console.log("updateTask Error (Store):", err);
                throw err;
            }
        },
    }
}