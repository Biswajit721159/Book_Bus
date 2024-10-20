
import { useGetUserQuery } from "../redux/UserApi";
import ManageTable from "./ManageTable";

const UserTable = () => {
    const params = { page: 1, name: '', email: '' }; // Update with real data as needed
    let { data, isLoading, isFetching, error } = useGetUserQuery(params); // pass the params here
    data = data?.data?.result || [];
    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    console.log("data is ", data);
    return (
        <>
            <ManageTable data={data} />
        </>
    );
};

export default UserTable;
