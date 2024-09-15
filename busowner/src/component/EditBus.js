import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Paper, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { convertUtcToIst } from '../helpers/USTtoIST';
import { editBus } from '../utilities/busApi';
import { toast } from 'react-toastify';
import { FullPageLoader } from './FullPageLoader';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const EditBus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(location.state?.data || {});
    const [load, setLoad] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("e.target", e.target);
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleStationChange = (index, e) => {
        const { name, value } = e.target;
        const newStationData = data.station_data.map((station, i) =>
            i === index ? { ...station, [name]: name === "Distance_from_Previous_Station" ? parseInt(value) : value.toUpperCase() } : station
        );
        setData((prevData) => ({ ...prevData, station_data: newStationData }));
    };

    const addStation = () => {
        setData((prevData) => ({
            ...prevData,
            station_data: [
                ...prevData.station_data,
                { station: '', arrived_time: '', Distance_from_Previous_Station: 0 }
            ]
        }));
    };

    const removeStation = (index) => {
        const newStationData = data.station_data.filter((_, i) => i !== index);
        setData((prevData) => ({ ...prevData, station_data: newStationData }));
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoad(true);
            let res = await editBus(data);
            if (res.statusCode === 200) {
                toast.success(res.message);
                navigate(-1);
            } else {
                toast.warn(res?.message);
            }
        } catch (e) {
            toast.warn(e?.message);
        } finally {
            setLoad(false);
        }
    };

    return (
        <Box p={3} className="mx-20 mr-20">
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="p" className='text-blue-500 cursor-pointer' onClick={() => navigate(-1)}>
                    Back
                </Typography>
                <Typography variant="h5" className='text-center mb-5' gutterBottom>
                    Edit Bus
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} className='bg-white'>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Id"
                                name="Id"
                                value={data._id || ''}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="createdAt"
                                name="createdAt"
                                value={convertUtcToIst(data.createdAt)}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="updatedAt"
                                name="updatedAt"
                                value={convertUtcToIst(data.updatedAt)}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                                disabled
                            />
                        </Grid>
                        <Grid className='mt-4' item xs={12} sm={4}>
                            <TextField
                                label="Email"
                                name="email"
                                value={data.email || ''}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                                disabled
                            />
                        </Grid>
                        <Grid className='mt-4' item xs={12} sm={4}>
                            <TextField
                                label="Bus Name"
                                name="bus_name"
                                value={data.bus_name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                            />
                        </Grid>
                        <Grid className='mt-4' item xs={12} sm={4}>
                            <TextField
                                label="Total Seats"
                                name="Total_seat"
                                type="number"
                                value={data.Total_seat || ''}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                size='small'
                            />
                        </Grid>
                        <Grid className='mt-1' item xs={12} sm={4}>
                            <InputLabel id="demo-select-small-label">Status</InputLabel>
                            <Select
                                className='flex flex-row gap-2 justify-start items-center text-sm'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={data.status}
                                onChange={handleInputChange}
                                size='small'
                                name='status'
                                sx={{ width: '150px' }}
                            >
                                <MenuItem value={'pending'}>
                                    <div className='flex flex-row gap-2 justify-start items-center text-sm'>
                                        <ColorComponent color={'blue'} />
                                        Pending
                                    </div>
                                </MenuItem>
                                <MenuItem value={'approved'}>
                                    <div className='flex flex-row gap-2 justify-start items-center text-sm'>
                                        <ColorComponent color={'green'} />
                                        Approved
                                    </div>
                                </MenuItem>
                                <MenuItem value={'rejected'}>
                                    <div className='flex flex-row gap-2 justify-start items-center text-sm'>
                                        <ColorComponent color={'red'} />
                                        Rejected
                                    </div>
                                </MenuItem>
                            </Select>
                        </Grid>
                        {data.station_data?.map((station, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper sx={{ p: 2, mb: 2 }}>
                                    <Box className="flex justify-between mb-2">
                                        <Typography variant="h6">Station {index + 1}</Typography>
                                        <IconButton color="error" onClick={() => removeStation(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Station"
                                                name="station"
                                                value={station.station || ''}
                                                onChange={(e) => handleStationChange(index, e)}
                                                fullWidth
                                                required
                                                size='small'
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Arrived Time"
                                                name="arrived_time"
                                                type="time"
                                                value={station.arrived_time || ''}
                                                onChange={(e) => handleStationChange(index, e)}
                                                fullWidth
                                                required
                                                size='small'
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Distance from Previous Station"
                                                name="Distance_from_Previous_Station"
                                                type="number"
                                                value={station.Distance_from_Previous_Station || 0}
                                                onChange={(e) => handleStationChange(index, e)}
                                                fullWidth
                                                required
                                                size='small'
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={addStation}
                                startIcon={<AddIcon />}
                            >
                                Add Station
                            </Button>
                        </Grid>
                        <Grid item xs={12} className='grid justify-center'>
                            <button
                                className='px-3 py-2 bg-green-500 rounded-md hover:bg-green-600 text-sm text-white shadow-md transform transition-transform hover:scale-105'
                                disabled={load}
                            >
                                {load ? 'Saving...' : 'Save Changes'}
                            </button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <FullPageLoader open={load} />
        </Box>
    );
};

const ColorComponent = ({ color }) => {
    return (
        <div className={`w-6 h-6 rounded-md bg-${color}-500 mr-3`}>

        </div>
    )
}

export default EditBus;
