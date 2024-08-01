import React, { useState } from 'react';
import {
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Backdrop,
    Fade,
} from '@mui/material';

const OTPModal = ({ open, handleClose, OTPVerified, sendOTP, errormess, submitLoading, resentLoading }) => {
    const [otp, setOtp] = useState('');

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        OTPVerified(otp);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid gray',
        boxShadow: 24,
        p: 3,
        textAlign: 'center',
        'border-radius': '2%'
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Enter OTP
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="OTP"
                            variant="outlined"
                            value={otp}
                            onChange={handleChange}
                            type='Number'
                        />
                        <div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                size='small'
                                disabled={submitLoading | resentLoading}
                                style={{ textTransform: 'none' }}
                            >
                                {submitLoading ? "Submitting" : "Submit"}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                                onClick={sendOTP}
                                disabled={submitLoading | resentLoading}
                                size='small'
                                style={{ textTransform: 'none', marginLeft: '10px' }}
                            >
                                {resentLoading ? "Resending" : "Resend"}
                            </Button>
                        </div>
                    </form>
                    <p style={{ color: 'red', marginTop: '5%' }}>{errormess}</p>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OTPModal;
