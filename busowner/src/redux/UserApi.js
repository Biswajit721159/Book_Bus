import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // ensure you're using /react

const api = process.env.REACT_APP_API;

export const userApiSlice = createApi({
    reducerPath: 'UserApi',
    baseQuery: fetchBaseQuery({
        baseUrl: api,
        prepareHeaders: (headers) => {
            const userinfo = JSON.parse(localStorage.getItem('user'));
            if (userinfo?.auth) {
                headers.set('Authorization', `Bearer ${userinfo.auth}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: ({ page, name, email }) => ({
                url: `/user/getUserByPage/?page=${encodeURIComponent(page)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useGetUserQuery } = userApiSlice;
