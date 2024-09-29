import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { addEmail, addId, addBookingDate, addBusName } from "../redux/bookingApiSlice";
const SearchingInput = () => {
    const [state, setState] = useState([
        {
            name: 'Email',
            placeholder: 'Enter Eamil',
            value: '',
            type: 'text'
        },
        {
            name: 'Id',
            placeholder: 'Enter Id',
            value: '',
            type: 'text'
        },
        {
            name: 'BookingDate',
            placeholder: 'Enter booking date',
            value: new Date(),
            type: 'date'
        },
        {
            name: 'BusName',
            placeholder: 'Enter bus bame',
            value: '',
            type: 'text'
        },
    ])

    const dispatch = useDispatch();

    const onChnageValue = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        if (name === "Email") {
            dispatch(addEmail(value));
        } else if (name === "Id") {
            dispatch(addId(value));
        } else if (name === "BookingDate") {
            dispatch(addBookingDate(value));
        } else if (name === "BusName") {
            dispatch(addBusName(value));
        }
        let newState = state.map((item) => {
            if (item.name === name) {
                return {
                    ...item,
                    value: value
                }
            } else {
                return item;
            }
        })
        setState(newState);
    }
    return (
        <div className="flex justify-end items-center flex-wrap">
            {
                state?.map((item, index) => (
                    <div key={index} className="relative">
                        <input
                            className="mt-2 mb-2 ml-3 mr-3 px-3 py-2 border rounded placeholder-gray-500 outline-blue-400"
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={item.value}
                            onChange={onChnageValue}
                            spellCheck="false"
                        />
                        {item?.value.length > 0 && item.type !== 'date' && (
                            <CloseIcon
                                fontSize="small"
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded-full p-1"
                                onClick={() => {
                                    onChnageValue({ target: { name: item.name, value: '' } });
                                }}
                            />
                        )}
                    </div>
                ))
            }
        </div>

    )
}
export default SearchingInput;