import { boardService } from "@/services/board-service.js"

export const boardStore = {
    state: {
        boards: [],
        // currBoard: null,
        isLoading: false,
    },
    getters: {
        // boards({ boards }) { return boards },
        boardsToShow(state) {
            var boards = JSON.parse(JSON.stringify(state.boards));
            return boards;
        },
        // getBoard({ currBoard }) { return currBoard },
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
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard)
        },
        updateBoard(state, payload) {
            const idx = state.boards.findIndex(board => board._id === payload.board._id)
            state.boards.splice(idx, 1, payload.board)
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
        async addBoard({ commit }, { board }) {
            try {
                const savedBoard = await boardService.save(board);
                commit({ type: 'addBoard', savedBoard })
                return savedBoard;
            } catch {
                console.log("Adding Error (Store):", err);
                throw err;
            }
        },
        async updateBoard({ commit }, { board }) {
            try {
                const savedBoard = await boardService.save(board);
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log('Editing Error (Store):', err);
                throw err;
            }
        },
        async removeBoard({ commit }, { boardId }) {
            try {
                const removedBoardId = await boardService.remove(boardId);
                commit({ type: 'removeBoard', boardId });
                return removedBoardId;
            } catch (err) {
                console.log('Removing Error (Store):', err);
                throw err;
            }
        },
        async updateGroup({ commit }, { boardId, group }) {
            try {
                const savedBoard = await boardService.updateGroup(group, boardId)
                commit({ type: 'updateBoard', board: savedBoard })
                return savedBoard;
            } catch (err) {
                console.log("Adding Error (Store):", err);
                throw err;
            }
        },
        // async addGroup({ commit }, { boardId }) {
        //     try {
        //         const savedGroup = await boardService.save(board);
        //         commit({ type: 'addGroup', savedBoard })
        //         return savedBoard;
        //     } catch {
        //         console.log("Adding Error (Store):", err);
        //         throw err;
        //     }
        // },
    }
}