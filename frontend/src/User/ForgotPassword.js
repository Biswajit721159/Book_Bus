import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const api = process.env.REACT_APP_API;

const ValidationItem = ({ valid, text }) => (
  <div className={`flex items-center gap-2 text-xs py-0.5 ${valid ? 'text-green-600' : 'text-surface-400'}`}>
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

const ForgotPassword = () => {
  const user = useSelector((state) => state.user);
  const history = useNavigate();

  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [touched, setTouched] = useState({});

  const [emailV, setEmailV] = useState(false);
  const [pwdV, setPwdV] = useState({ upper: false, lower: false, digit: false, special: false, len: false });
  const [confirmV, setConfirmV] = useState(false);

  useEffect(() => {
    if (user?.user?.auth) history('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resendTimeout > 0) {
      const t = setTimeout(() => setResendTimeout((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimeout]);

  const handleEmailChange = (s) => {
    s = s.replace(/\s+/g, '');
    setEmail(s);
    setEmailV(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(s));
    setErrorMsg('');
  };

  const handlePasswordChange = (s) => {
    s = s.replace(/\s+/g, '');
    setPassword(s);
    setPwdV({
      upper: /[A-Z]/.test(s),
      lower: /[a-z]/.test(s),
      digit: /\d/.test(s),
      special: /[^\w\d]/.test(s),
      len: s.length >= 8 && s.length <= 15,
    });
    setConfirmV(confirmPassword.length > 0 && confirmPassword === s);
    setErrorMsg('');
  };

  const handleConfirmChange = (s) => {
    setConfirmPassword(s);
    setConfirmV(s.length > 0 && s === password);
    setErrorMsg('');
  };

  const pwdAllValid = Object.values(pwdV).every(Boolean);
  const allValid = emailV && pwdAllValid && confirmV;

  const sendOTP = async () => {
    setTouched({ email: true, password: true, confirm: true });
    if (!allValid) {
      setErrorMsg('Please fix all validation errors before continuing.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${api}/Verification/ForgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.statusCode === 200) {
        setStep(2);
        setResendTimeout(60);
        toast.success(data.message || 'OTP sent to your email');
      } else {
        setErrorMsg(data.message);
      }
    } catch {
      setLoading(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const resendOTP = async () => {
    if (resendTimeout > 0) return;
    try {
      setLoading(true);
      const res = await fetch(`${api}/Verification/ForgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.statusCode === 200) {
        setResendTimeout(60);
        toast.success('OTP resent');
      } else {
        setErrorMsg(data.message);
      }
    } catch {
      setLoading(false);
      setErrorMsg('Something went wrong.');
    }
  };

  const verifyOTP = async (e) => {
    e?.preventDefault();
    if (!otp) { setErrorMsg('Please enter the OTP'); return; }
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${api}/Verification/passwordSave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.statusCode === 200) {
        toast.success('Password reset successfully!');
        history('/Login');
      } else {
        setErrorMsg(data.message);
      }
    } catch {
      setLoading(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Reset Password</h1>
          <p className="text-surface-500 text-sm mt-1">
            {step === 1 ? 'Enter your details to reset your password' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${step >= s ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-500'}`}>
                {step > s ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : s}
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 max-w-[60px] ${step > s ? 'bg-primary-600' : 'bg-surface-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8">
          {step === 1 ? (
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`input-field ${touched.email && email && !emailV ? 'input-error' : touched.email && emailV ? 'input-success' : ''}`}
                  placeholder="you@example.com"
                />
                {touched.email && email && !emailV && (
                  <p className="mt-1.5 text-xs text-red-600">Please enter a valid email address</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`input-field pr-10 ${touched.password && password && !pwdAllValid ? 'input-error' : touched.password && pwdAllValid ? 'input-success' : ''}`}
                    placeholder="Create a strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                    </svg>
                  </button>
                </div>
                {touched.password && password && (
                  <div className="mt-2 p-3 bg-surface-50 rounded-lg grid grid-cols-2 gap-1">
                    <ValidationItem valid={pwdV.upper} text="Uppercase letter" />
                    <ValidationItem valid={pwdV.lower} text="Lowercase letter" />
                    <ValidationItem valid={pwdV.digit} text="Number" />
                    <ValidationItem valid={pwdV.special} text="Special character" />
                    <ValidationItem valid={pwdV.len} text="8–15 characters" />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmChange(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                    className={`input-field pr-10 ${touched.confirm && confirmPassword && !confirmV ? 'input-error' : touched.confirm && confirmV ? 'input-success' : ''}`}
                    placeholder="Repeat your password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirm ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                    </svg>
                  </button>
                </div>
                {touched.confirm && confirmPassword && !confirmV && (
                  <p className="mt-1.5 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              <button onClick={sendOTP} disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                ) : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-surface-600">OTP sent to</p>
                <p className="font-semibold text-surface-900">{email}</p>
              </div>

              <form onSubmit={verifyOTP} className="space-y-4">
                <div>
                  <label className="label">Enter OTP</label>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setErrorMsg(''); }}
                    className="input-field text-center text-2xl font-bold tracking-widest"
                    placeholder="0000"
                    maxLength={4}
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errorMsg}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</>
                  ) : 'Reset Password'}
                </button>
              </form>

              <div className="text-center text-sm text-surface-500">
                {resendTimeout > 0 ? (
                  <span>Resend OTP in <strong className="text-surface-700">{resendTimeout}s</strong></span>
                ) : (
                  <button onClick={resendOTP} disabled={loading} className="text-primary-600 font-medium hover:text-primary-700">
                    {loading ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              <button onClick={() => { setStep(1); setErrorMsg(''); }} className="btn-ghost w-full text-surface-500">
                ← Back to form
              </button>
            </div>
          )}

          <p className="text-center text-sm text-surface-500 mt-6">
            Remember your password?{' '}
            <Link to="/Login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
