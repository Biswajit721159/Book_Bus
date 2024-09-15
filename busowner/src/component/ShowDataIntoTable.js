import { convertUtcToIst } from '../helpers/USTtoIST';
import { Link, useNavigate } from 'react-router-dom';

const ShowDataIntoTable = ({ data }) => {
    const history = useNavigate();
    return (
        <table className="container table mt-5">
            <thead>
                <tr>
                    <th className='text-center text-gray-500' scope="col">#</th>
                    <th className='text-center text-gray-500' scope="col">Bus Name</th>
                    <th className='text-center text-gray-500' scope="col">Total Seat</th>
                    <th className='text-center text-gray-500' scope="col">Src To Dist</th>
                    <th className='text-center text-gray-500' scope="col">Create At</th>
                    <th className='text-center text-gray-500' scope="col">Action Taken</th>
                    <th className='text-center text-gray-500' >view</th>
                    <th className='text-center text-gray-500' >edit</th>
                    <th className='text-center text-gray-500' >delete</th>
                </tr>
            </thead>
            <tbody>
                {data?.length ?
                    data?.map((item, ind) => (
                        <tr key={ind}>
                            <th className='text-center' scope="row">{ind + 1}</th>
                            <td className='text-center'>{item?.bus_name}</td>
                            <td className='text-center' >{item?.Total_seat}</td>
                            <th className='text-center'>*{item?.station_data[0]?.station} - {item?.station_data[(item?.station_data?.length) - 1]?.station}</th>
                            <td className='text-center' >{convertUtcToIst(item?.createdAt)}</td>
                            <td className='text-center' >
                                <button className={`px-3 p-1.5 bg-${item?.status === "pending" ? 'blue' : (item?.status === "approved" ? 'green' : 'red')}-500 rounded-md text-white text-sm`}
                                    onClick={() => history('/EditBus', { state: { data: item, type: 'edit' } })}
                                >
                                    {item?.status}
                                </button>
                            </td>
                            <td className='text-center' >
                                <Link to={`/View_Bus/${item?._id}`}>
                                    <button className='px-3 p-1.5 bg-orange-500 rounded-md hover:bg-orange-600 text-white text-sm'>View</button>
                                </Link>
                            </td>
                            <td className='text-center'>
                                <button
                                    className='px-3 p-1.5 bg-sky-500 rounded-md hover:bg-sky-600 text-white text-sm'
                                    onClick={() => history('/EditBus', { state: { data: item, type: 'edit' } })}
                                >
                                    Edit
                                </button>
                            </td>
                            <td className='text-center'>
                                <button className='px-3 p-1.5 bg-red-500 rounded-md hover:bg-red-600 text-white text-sm' >Delete</button>
                            </td>
                        </tr>
                    ))
                    : <tr>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                        <td className='text-center'>Na</td>
                    </tr>
                }
            </tbody>
        </table >
    )
}

export default ShowDataIntoTable;