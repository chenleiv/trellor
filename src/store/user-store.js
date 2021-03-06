import { userService } from '../services/user-service-upgrade.js';
// import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'

// var localLoggedinUser = null;
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null);

export const userStore = {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: [],
        watchedUser: null,
    },
    getters: {
        users({ users }) {
            return users;
        },
        loggedinUser({ loggedinUser }) {
            return loggedinUser;
        },
        watchedUser({ watchedUser }) {
            return watchedUser;
        },
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            state.loggedinUser = user ? { ...user } : null;
        },
        setWatchedUser(state, { user }) {
            state.watchedUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter((user) => user._id !== userId);
        },
    },
    actions: {
        async login({ commit }, { user }) {
            try {
                const currUser = await userService.login(user);
                commit({ type: 'setLoggedinUser', user: currUser });
                return user;
            } catch (err) {
                // console.log('userStore: Error in login', err);
                throw err;
            }
        },
        async signup({ commit }, { user }) {
            // console.log('user', user);
            try {
                const currUser = await userService.signup(user);
                commit({ type: 'setLoggedinUser', user: currUser });
                return user;
            } catch (err) {
                console.log('userStore: Error in signup', err);
                throw err;
            }
        },
        async logout({ commit }) {
            try {
                await userService.logout();
                commit({ type: 'setLoggedinUser', user: null });
            } catch (err) {
                console.log('userStore: Error in logout', err);
                throw err;
            }
        },
        async loadUsers({ commit }) {
            // TODO: loading
            try {
                const users = await userService.getUsers();
                commit({ type: 'setUsers', users });
            } catch (err) {
                console.log('userStore: Error in loadUsers', err);
                throw err;
            }
        },
        async loadAndWatchUser({ commit }, { userId }) {
            try {
                const user = await userService.getById(userId);
                commit({ type: 'setWatchedUser', user });
                socketService.emit(SOCKET_EMIT_USER_WATCH, userId);
                socketService.off(SOCKET_EVENT_USER_UPDATED);
                socketService.on(SOCKET_EVENT_USER_UPDATED, (user) => {
                    commit({ type: 'setWatchedUser', user });
                });
            } catch (err) {
                console.log('userStore: Error in loadAndWatchUser', err);
                throw err;
            }
        },
        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId);
                commit({ type: 'removeUser', userId });
            } catch (err) {
                console.log('userStore: Error in removeUser', err);
                throw err;
            }
        },
        async updateUser({ commit }, { user }) {
            try {
                user = await userService.update(user);
                commit({ type: 'setUser', user });
            } catch (err) {
                console.log('userStore: Error in updateUser', err);
                throw err;
            }
        },
        // async increaseScore({ commit }) {
        //     try {
        //         const score = await userService.changeScore(100)
        //         commit({ type: 'setUserScore', score })
        //     } catch (err) {
        //         console.log('userStore: Error in increaseScore', err)
        //         throw err
        //     }
    },
};
