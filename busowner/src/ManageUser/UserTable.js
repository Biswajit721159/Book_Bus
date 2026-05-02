import React from "react";
import { useGetUserQuery } from "../redux/UserApi";
import ManageTable from "./ManageTable";
import { FullPageLoader } from "../component/FullPageLoader";

const UserTable = () => {
    const params = { page: 1, name: '', email: '' };
    let { data, isLoading, isFetching, error } = useGetUserQuery(params);
    data = data?.data?.result || [];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">User Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">View and manage registered users</p>
            </div>

            {error ? (
                <div className="card p-6 text-center">
                    <div className="flex flex-col items-center gap-2 text-red-400">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-medium text-red-600">Failed to load users</p>
                    </div>
                </div>
            ) : (
                <ManageTable data={data} />
            )}

            <FullPageLoader open={isLoading || isFetching} />
        </div>
    );
};

export default UserTable;
