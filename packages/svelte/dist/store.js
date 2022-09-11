import { writable } from 'svelte/store';
const initialValues = {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null
};
const user = writable(initialValues.user);
const setUser = (usr) => user.set(usr);
const accessToken = writable(initialValues.accessToken);
const setAccessToken = (token) => accessToken.set(token);
const isLoading = writable(initialValues.isLoading);
const setIsLoading = (loading) => isLoading.set(loading);
const error = writable(initialValues.error);
const setError = (err) => error.set(err);
const resetAll = () => {
    setUser(initialValues.user);
    setAccessToken(initialValues.accessToken);
    setIsLoading(initialValues.isLoading);
    setError(initialValues.error);
};
export { user, setUser, accessToken, setAccessToken, isLoading, setIsLoading, error, setError, resetAll };
