import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { usermethod } from '../redux/UserSlice';
import { SendOTP, VerifyOTP } from './controlerApi';

const ValidationItem = ({ valid, text }) => (
  <div className={`validation-item ${valid ? 'validation-pass' : 'validation-fail'}`}>
    {valid ? (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )}
    <span>{text}</span>
  </div>
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [showValidation, setShowValidation] = useState({ email: false, password: false });

  const [emailValid, setEmailValid] = useState(false);
  const [pwdValid, setPwdValid] = useState({ upper: false, lower: false, digit: false, special: false, len: false });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('user'));
    if (auth) navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (resendTimeout > 0) {
      const t = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimeout]);

  const validateEmail = (s) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(s);

  const handleEmailChange = (s) => {
    s = s.replace(/\s+/g, '');
    setEmail(s);
    setEmailValid(validateEmail(s));
    setErrorMsg('');
  };

  const handlePasswordChange = (s) => {
    s = s.replace(/\s+/g, '');
    setPassword(s);
    setPwdValid({
      upper: /[A-Z]/.test(s),
      lower: /[a-z]/.test(s),
      digit: /\d/.test(s),
      special: /[^\w\d]/.test(s),
      len: s.length >= 8 && s.length <= 15,
    });
    setErrorMsg('');
  };

  const allValid = emailValid && pwdValid.upper && pwdValid.lower && pwdValid.digit && pwdValid.special && pwdValid.len;

  const handleSendOtp = async () => {
    if (!allValid) {
      setShowValidation({ email: true, password: true });
      return;
    }
    try {
      setSendingOtp(true);
      setErrorMsg('');
      setDisabled(true);
      const result = await SendOTP(email, password);
      setSendingOtp(false);
      if (result.statusCode === 200) {
        setShowOtpModal(true);
        setResendTimeout(60);
      } else {
        setDisabled(false);
        setErrorMsg(result.message);
      }
    } catch {
      setSendingOtp(false);
      setDisabled(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (otp.length !== 4) { setErrorMsg('OTP must be 4 digits'); return; }
    try {
      setVerifyingOtp(true);
      setErrorMsg('');
      const result = await VerifyOTP(email, password, otp);
      setVerifyingOtp(false);
      if (result.statusCode === 200) {
        dispatch(usermethod.Add_User(result.data));
        navigate(-1);
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setVerifyingOtp(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const handleResend = async () => {
    if (resendTimeout > 0) return;
    try {
      setSendingOtp(true);
      setErrorMsg('');
      const result = await SendOTP(email, password);
      setSendingOtp(false);
      if (result.statusCode === 200) {
        setResendTimeout(60);
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setSendingOtp(false);
      setErrorMsg('Something went wrong.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
          <p className="text-surface-500 text-sm mt-1">Sign in to your BlueBus account</p>
        </div>

        <div className="card p-8">
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onFocus={() => setShowValidation(v => ({ ...v, email: true }))}
                  disabled={disabled}
                  className={`input-field pr-10 ${showValidation.email && email && !emailValid ? 'input-error' : showValidation.email && emailValid ? 'input-success' : ''}`}
                  placeholder="you@example.com"
                />
                {email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValid
                      ? <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      : <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/ForgotPassword" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setShowValidation(v => ({ ...v, password: true }))}
                  disabled={disabled}
                  className={`input-field pr-10 ${showValidation.password && password && !Object.values(pwdValid).every(Boolean) ? 'input-error' : showValidation.password && Object.values(pwdValid).every(Boolean) ? 'input-success' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>

              {/* Password validation */}
              {showValidation.password && password && (
                <div className="mt-2 p-3 bg-surface-50 rounded-lg grid grid-cols-2 gap-1">
                  <ValidationItem valid={pwdValid.upper} text="Uppercase letter" />
                  <ValidationItem valid={pwdValid.lower} text="Lowercase letter" />
                  <ValidationItem valid={pwdValid.digit} text="Number" />
                  <ValidationItem valid={pwdValid.special} text="Special character" />
                  <ValidationItem valid={pwdValid.len} text="8–15 characters" />
                </div>
              )}
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={disabled || sendingOtp}
              className="btn-primary w-full py-2.5"
            >
              {sendingOtp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </>
              ) : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don't have an account?{' '}
            <Link to="/Register" className="text-primary-600 font-medium hover:text-primary-700">Sign up</Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowOtpModal(false)}>
          <div className="modal-box p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
              <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-1">Check your email</h2>
            <p className="text-sm text-surface-500 mb-6">We sent a 4-digit OTP to <strong className="text-surface-700">{email}</strong></p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="number"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setErrorMsg(''); }}
                className="input-field text-center text-2xl font-bold tracking-widest"
                placeholder="0000"
                maxLength={4}
              />

              {errorMsg && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button type="submit" disabled={verifyingOtp || sendingOtp} className="btn-primary w-full py-2.5">
                {verifyingOtp ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                ) : 'Verify & Sign In'}
              </button>

              <div className="text-sm text-surface-500">
                {resendTimeout > 0 ? (
                  <span>Resend OTP in <strong className="text-surface-700">{resendTimeout}s</strong></span>
                ) : (
                  <button type="button" onClick={handleResend} disabled={sendingOtp} className="text-primary-600 font-medium hover:text-primary-700">
                    {sendingOtp ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
