import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useDispatch, useSelector } from "react-redux";
import { usermethod } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Person2Icon from '@mui/icons-material/Person2';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LogoutIcon from '@mui/icons-material/Logout';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
    const userinfo = useSelector((state) => state.userAuth.user);
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const history = useNavigate();

    const list = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
        >
            <List>

                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={userinfo?.user.fullName}
                        />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem onClick={() => history('/')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={'Home'} />
                    </ListItemButton>
                </ListItem>

                {otherUserinfo.role === '100' ?
                    <>
                        <ListItem onClick={() => history('/BusAdder')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Person2Icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Add Bus'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem onClick={() => history('/ViewSeat')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BookOnlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'View Seat'} />
                            </ListItemButton>
                        </ListItem>
                    </>
                    :
                    <>
                        <ListItem onClick={() => history('/ManageUser')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Person2Icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Manage User'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem onClick={() => history('/Booking')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BookOnlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Manage Booking'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem onClick={() => history('/ManageBus')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DirectionsBusFilledIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Manage Bus'} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem onClick={() => history('/ManageMasterlist')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <RecentActorsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Manage Masterlist'} />
                            </ListItemButton>
                        </ListItem>
                    </>
                }

                <ListItem onClick={Logout}>
                    <ListItemButton>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Logout'} />
                    </ListItemButton>
                </ListItem>

            </List>
        </Box>
    );

    async function Logout() {
        dispatch(usermethod.Logout_User());
        navigate('/Login');
        toast("Successfully logout");
    }

    function goToMainPage() {
        if (otherUserinfo.role === '100') {
            navigate('Adminpanel')
        } else if (otherUserinfo.role === '200') {
            navigate('SuperAdminpanel');
        }
    }

    return (
        <>
            <nav className="bg-blue-500 shadow text-white bg-gradient-to-r from-blue-500 to-z-500">
                <div className="max-w-7xl px-1 sm:px-1 lg:px-1">
                    <div className="flex justify-start h-16 items-center">
                        {userinfo ? <div>
                            <IconButton
                                color="inherit"
                                className="mx-2"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div> : ''}
                        <div className="flex items-center">
                            <p className="text-xl font-semibold flex items-center cursor-pointer mx-5" onClick={() => goToMainPage()}>
                                {
                                    otherUserinfo.role === "100" ?
                                        'Adminpanel'
                                        : otherUserinfo.role === "200" ? 'SuperAdminpanel' : ''
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </nav >
            {userinfo ? <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {list('left')}
            </Drawer> : ''}
        </>
    );
};

export default Navbar;
