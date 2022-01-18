import { boardService } from '@/services/board-service.js';
import {
    socketService,
    SOCKET_EVENT_BOARD_UPDATED,
} from '../services/socket.service';

export const boardStore = {
    state: {
        boards: [],
        currBoard: null,
        isLoading: false,
        watchedBoard: null,
    },
    getters: {
        boards({ boards }) {
            return boards;
        },
        boardsToShow(state) {
            return state.boards;
        },
        getCurrBoard(state) {
            return state.currBoard;
        },
        isLoading({ isLoading }) {
            return isLoading;
        },
        // watchedBoard({ watchedBoard }) { return watchedBoard }
    },
    mutations: {
        setLoading(state, { isLoading }) {
            state.isLoading = isLoading;
        },
        getBoard(state, { board }) {
            state.currBoard = board;
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        setBoard(state, { board }) {
            state.currBoard = board;
        },
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard);
        },
        updateBoard(state, { board }) {
            state.currBoard = board;
            console.log('hi from mutations updateBoard');
            const idx = state.boards.findIndex(
                (currB) => currB._id === board._id
            );
            state.boards.splice(idx, 1, board);
            // console.log(' state.currBoard from mutations ', state.currBoard._id);
        },
        removeBoard(state, payload) {
            const idx = state.boards.findIndex(
                (board) => board._id === payload.boardId
            );
            state.boards.splice(idx, 1);
        },
        // addActivity(state, { activity }) {
        //     boardService.addActivity(state.currBoard._id, activity)
        //     state.currBoard.activities.unshift(activity);
        // }
        // setWatchedBoard(state, { board }) {
        //     state.watchedBoard = board;
        // },
    },
    actions: {
        async loadBoards({ commit, state }) {
            // const filterBy = state.filterBy;
            commit({ type: 'setLoading', isLoading: true });
            try {
                const boards = await boardService.query();
                commit({ type: 'setBoards', boards });
                socketService.on('User connected', (msg) => {
                    console.log('msg', msg);
                });
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
            commit({ type: 'setBoard', board });
        },

        async addBoard({ commit }, { board }) {
            try {
                const savedBoard = await boardService.save(board);
                commit({ type: 'addBoard', savedBoard });
                // socketService.off('update-board')
                // socketService.emit('update-board', newBoard)
                // socketService.on(SOCKET_EVENT_BOARD_UPDATED, newBoard => {
                // })
                return savedBoard;
            } catch (err) {
                console.log('addBoard (Store):', err);
                throw err;
            }
        },

        async updateBoard({ commit }, { board }) {
            try {
                const newBoard = await boardService.save(board);
                console.log('updateBoard');
                socketService.emit('update-board', newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    commit({ type: 'updateBoard', board: newBoard });
                    console.log('%c updateBoard', 'background: yellow');
                });
                return newBoard;
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },

        async updateBoardTitle({ commit }, { boardId, title }) {
            try {
                const newBoard = await boardService.updateBoardTitle(
                    boardId,
                    title
                );
                commit({ type: 'updateBoard', board: newBoard });
                // socketService.emit('update-board', newBoard)
                // socketService.off('update-board')
                // socketService.on(SOCKET_EVENT_BOARD_UPDATED, newBoard => {
                //     commit({ type: 'getBoard', board: newBoard })
                //     console.log('%c updateBoardTitle', 'background: green');
                // })
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },

        async addGroup({ commit }, { boardId, groupTitle }) {
            try {
                const newBoard = await boardService.addGroup(
                    boardId,
                    groupTitle
                );
                commit({ type: 'updateBoard', board: newBoard });
                // socketService.emit(SOCKET_EVENT_BOARD_UPDATED, newBoard)
                // socketService.off('update-board')
                // socketService.on(SOCKET_EVENT_BOARD_UPDATED, newBoard => {
                // dispatch({ type: 'getBoard', boardId: boardId })
                // console.log('%c Im getting here', 'background: green');
                // console.log('Got savedBoard ##$%%^&&** from socket', newBoard);
                // })
            } catch (err) {
                console.log('addGroup (Store):', err);
                throw err;
            }
        },

        async updateBoardBgc({ commit }, { boardId, style }) {
            // console.log('boardId store', boardId);
            try {
                const newBoard = await boardService.updateBgcBoard(
                    boardId,
                    style
                );
                commit({ type: 'updateBoard', board: newBoard });
                socketService.emit(SOCKET_EVENT_BOARD_UPDATED, newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    // commit({ type: 'updateBoard', board: newBoard })
                    commit({ type: 'getBoard', board: newBoard });
                    console.log('%c updateBoardBgc', 'background: green');
                });
            } catch (err) {
                console.log('updateBoard (Store):', err);
                throw err;
            }
        },

        async removeBoard({ commit }, { boardId }) {
            try {
                await boardService.remove(boardId);
                commit({ type: 'removeBoard', boardId });
            } catch (err) {
                console.log('removeBoard (Store):', err);
                throw err;
            }
        },

        async updateGroup({ commit }, { boardId, group }) {
            try {
                const newBoard = await boardService.updateGroup(boardId, group);
                commit({ type: 'updateBoard', board: newBoard });
                console.log('updateGroup');
                // Working with socket from updateBoard
            } catch (err) {
                console.log('updateGroup (Store):', err);
                throw err;
            }
        },

        async removeGroup({ commit }, { boardId, groupId }) {
            try {
                const newBoard = await boardService.removeGroup(
                    boardId,
                    groupId
                );
                commit({ type: 'updateBoard', board: newBoard });
                // socketService.emit('update-board', newBoard)
                // socketService.off('update-board')
                // socketService.on(SOCKET_EVENT_BOARD_UPDATED, newBoard => {
                //     // commit({ type: 'getBoard', board: newBoard })
                //     console.log('%c updateBoard', 'background: yellow');
                // })
            } catch (err) {
                console.log('removeGroup (Store):', err);
                throw err;
            }
        },
        async addGroup({ commit }, { boardId, groupTitle }) {
            try {
                const newBoard = await boardService.addGroup(
                    boardId,
                    groupTitle
                );
                commit({ type: 'updateBoard', board: newBoard });
                socketService.emit('update-board', newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    commit({ type: 'getBoard', board: newBoard });
                    console.log('%c updateBoard', 'background: yellow');
                });
            } catch (err) {
                console.log('addGroup (Store):', err);
                throw err;
            }
        },

        async addTask({ commit }, { boardId, groupId, taskTitle }) {
            try {
                const newBoard = await boardService.addTask(
                    boardId,
                    groupId,
                    taskTitle
                );
                commit({ type: 'updateBoard', board: newBoard });
                socketService.emit('update-board', newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    commit({ type: 'getBoard', board: newBoard });
                    console.log('%c updateBoard', 'background: yellow');
                });
            } catch (err) {
                console.log('addTask Error (Store):', err);
                throw err;
            }
        },

        async updateTask({ commit }, { boardId, groupId, task }) {
            try {
<<<<<<< HEAD
                const newBoard = await boardService.updateTask(
                    boardId,
                    groupId,
                    task
                );
                commit({ type: 'updateBoard', board: newBoard });
                socketService.emit('update-board', newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    commit({ type: 'getBoard', board: newBoard });
                    console.log('%c updateBoard', 'background: yellow');
                });
=======
                const newBoard = await boardService.updateTask(boardId, groupId, task);
                commit({ type: 'updateBoard', board: newBoard })
                socketService.emit('update-board', newBoard)
                socketService.off('update-board')
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, newBoard => {
                    commit({ type: 'getBoard', board: newBoard })
                })
>>>>>>> 23a9a931bc59f5df3d8e6c4740b5a3687f06c9d2
            } catch (err) {
                console.log('updateTask Error (Store):', err);
                throw err;
            }
        },

        async removeTask({ commit }, { boardId, groupId, task }) {
            try {
                const newBoard = await boardService.removeTask(
                    boardId,
                    groupId,
                    task
                );
                commit({ type: 'updateBoard', board: newBoard });
                socketService.emit('update-board', newBoard);
                socketService.off('update-board');
                socketService.on(SOCKET_EVENT_BOARD_UPDATED, (newBoard) => {
                    //     // commit({ type: 'getBoard', board: newBoard })
                    console.log('%c updateBoard', 'background: yellow');
                });
            } catch (err) {
                console.log('removeGroup (Store):', err);
                throw err;
            }
        },
        // async loadAndWatchBoard({ commit }, { boardId }) {
        //     try {
        //         const board = await boardService.getById(boardId);
        //         commit({ type: 'setWatchedBoard', board })
        //         socketService.emit(SOCKET_EVENT_BOARD_UPDATED, board)
        //         socketService.off(SOCKET_EVENT_BOARD_UPDATED)
        //         socketService.on(SOCKET_EVENT_BOARD_UPDATED, board => {
        //             commit({ type: 'setWatchedBoard', board })
        //         })
        //     } catch (err) {
        //         console.log('boardStore: Error in loadAndWatchBoard', err)
        //         throw err
        //     }
        // },
    },
};

// async updateTask({ commit }, { boardId, groupId, task }) {
//     try {
//         const savedBoard = await boardService.updateTask(boardId, groupId, task);
//         commit({ type: 'updateBoard', board: savedBoard })
//     } catch (err) {
//         console.log("updateTask Error (Store):", err);
//         throw err;
//     }
// },
