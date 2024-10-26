import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { convertUtcToIst2 } from '../helpers/USTtoIST';
import { toast } from 'react-toastify';
import { updateUser } from '../utilities/authApi';

const ManageTable = ({ data, setData }) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({ name: '', email: '' });

    const handleEdit = (user) => {
        setEditedUser({ name: user.name, email: user.email });
        setEditDialogOpen(true);
    };

    const handleClose = () => {
        setEditDialogOpen(false);
    };

    const handleSave = async () => {
        try {
            let data = await updateUser(editedUser);
            handleClose();
            toast.success('Successfully update');
        } catch (e) {
            toast.warn(e.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center my-4">User Table</h1>
            <TableContainer component={Paper} className="max-w-4xl mx-auto shadow-lg">
                <Table>
                    <TableHead className="bg-blue-500 text-white">
                        <TableRow>
                            <TableCell className="text-lg font-semibold text-white text-center">Full Name</TableCell>
                            <TableCell className="text-lg font-semibold text-white text-center">Email</TableCell>
                            <TableCell className="text-lg font-semibold text-white text-center">Register Date</TableCell>
                            <TableCell className="text-lg font-semibold text-white text-center">Last Update</TableCell>
                            <TableCell className="text-lg font-semibold text-white text-center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((el, index) => (
                            <TableRow key={index} className="hover:bg-gray-100">
                                <TableCell className="text-center">{el.name}</TableCell>
                                <TableCell className="text-center">
                                    <p className='text-blue-500'>{el.email}</p>
                                </TableCell>
                                <TableCell className="text-center">{convertUtcToIst2(el.createdAt)}</TableCell>
                                <TableCell className="text-center">{convertUtcToIst2(el.updatedAt)}</TableCell>
                                <TableCell className="text-center">
                                    <Tooltip title='Edit'>
                                        <EditIcon
                                            className='rounded-lg text-blue-500 cursor-pointer'
                                            onClick={() => handleEdit(el)}
                                        />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editDialogOpen} onClose={handleClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editedUser.email}
                        onChange={handleChange}
                        size='small'
                        spellCheck={false}
                        disabled={true}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        value={editedUser.name}
                        onChange={handleChange}
                        size='small'
                        spellCheck={false}
                    />
                </DialogContent>
                <DialogActions>
                    <button className='p-2 text-white text-sm bg-red-500 rounded-md' onClick={handleClose} color="primary">cancel</button>
                    <button className='p-2 text-white text-sm bg-blue-500 rounded-md' onClick={handleSave} color="primary">save</button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageTable;

