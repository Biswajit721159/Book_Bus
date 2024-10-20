import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertUtcToIst } from '../helpers/USTtoIST';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ManageTable = ({ data, setData }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDelete = () => {

    };

    const openDeleteDialog = (index) => {
        setSelectedUser(index);
        setDeleteDialogOpen(true);
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
                            <TableCell className="text-lg font-semibold text-white text-center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data?.map((el, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{el.name}</TableCell>
                                    <TableCell className="text-center">
                                        <p className='text-blue-500'>{el.email}</p>
                                    </TableCell>
                                    <TableCell className="text-center">{convertUtcToIst(el.createdAt)}</TableCell>
                                    <TableCell className="text-center">{convertUtcToIst(el.updatedAt)}</TableCell>
                                    <TableCell className="text-center">
                                        <Tooltip title='Edit'>
                                            <EditIcon
                                                className='rounded-lg text-blue-500 cursor-pointer'
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Tooltip title='Delete'>
                                            <DeleteIcon
                                                className='text-red-500 cursor-pointer'
                                                onClick={() => openDeleteDialog(index)}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" className="text-xl font-bold">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description" className="text-base">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        className="text-gray-500 bg-gray-500 hover:text-gray-700"
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        className="text-red-500 bg-red-500 hover:text-red-700"
                        autoFocus
                        sx={{ textTransform: 'none' }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageTable;
