import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { GoXCircleFill } from "react-icons/go";
import { HiCheckCircle } from "react-icons/hi";
import swal from 'sweetalert'
import '../stylesheet/Auth.css'
const api = process.env.REACT_APP_API
const Register = () => {

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const history = useNavigate();


  const [disabled, setdisabled] = useState(false)
  const [resent, setresent] = useState(false)

  const [wronginformation, setwronginformation] = useState(false);
  const [messwronginformation, setmesswronginformation] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [registerandloginlink, setregisterandloginlink] = useState(true)

  const [namecontrol, setnamecontrol] = useState({
    charcter: false,
    word: false,
    lenWord: false,
    len: false,
    specialCharacters: false,
    shownamefrom: false,
    show_name_error_text: false
  })

  const [emailcontrol, setemailcontrol] = useState({
    wrongemail: false,
    showemailfrom: false,
    show_email_error_text: false
  })

  const [passwordcontrol, setpasswordcontrol] = useState({
    uppercase: false,
    lowercase: false,
    digit: false,
    specialCharacters: false,
    len: false,
    showpasswordfrom: false,
    show_password_error_text: false
  })

  const [confirmpasswordcontrol, setconfirmpasswordcontrol] = useState({
    isPasswordandconfirmPasswordIsSame: false,
    showconfirmpasswordfrom: false,
    show_confirmpassword_error_text: false
  })

  const [otp, setotp] = useState({
    showOtpfrom: false,
    otpFromdata: "",
    showOtpButton: false,
    disabledOtpForm: false,
    loginbutton: false,
  })



  useEffect(() => {
    const auth = localStorage.getItem('user')
    if (auth) {
      history('/')
    }
  }, [])

  function onErrorText(text) {
    setnamecontrol((prevUserData) => ({
      ...prevUserData,
      show_name_error_text: false
    }));
    setemailcontrol((prevUserData) => ({
      ...prevUserData,
      show_email_error_text: false
    }));
    setpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      show_password_error_text: false
    }));
    setconfirmpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      show_confirmpassword_error_text: false
    }));
    if (text == "name") {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        show_name_error_text: true
      }));
    }
    else if (text == "email") {
      setemailcontrol((prevUserData) => ({
        ...prevUserData,
        show_email_error_text: true
      }));
    }
    else if (text == "password") {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        show_password_error_text: true
      }));
    }
    else if (text == "confirmpassword") {
      setconfirmpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        show_confirmpassword_error_text: true
      }));
    }
  }

  //name section
  function containsNumber(inputString) {
    return /\d/.test(inputString);
  }

  function checkforname(e) {
    onErrorText("name")
    setwronginformation(false);
    let s = e.target.value;
    s = s.replace(/\s+/g, ' ');
    setname(s)
    let a = containsNumber(s);
    if (s.length == 0) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        charcter: false,
        word: false,
        lenWord: false,
        len: false,
        specialCharacters: false
      }));
      return
    }
    if (a) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        charcter: false,
      }));
    }
    else {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        charcter: true,
      }));
    }
    const wordsArray = s.trim().split(/\s+/);

    if (wordsArray.length <= 1) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        word: false,
      }));
    }
    else {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        word: true,
      }));
    }
    let count = 0;
    wordsArray.forEach(element => {
      if (element.length <= 1) {
        count++;
        setnamecontrol((prevUserData) => ({
          ...prevUserData,
          lenWord: false,
        }));
      }
    });
    if (count == 0) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        lenWord: true,
      }));
    }

    if (s.length >= 6 && s.length <= 20) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        len: true,
      }));
    }
    else {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        len: false,
      }));
    }
    count = 0
    let arr = s.split('')
    arr.forEach((data) => {
      if ((data >= 'a' && data <= 'z') || (data >= 'A' && data <= 'Z') || data == ' ') {

      }
      else {
        count++;
      }
    })
    if (count == 0) {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        specialCharacters: true,
      }));
    } else {
      setnamecontrol((prevUserData) => ({
        ...prevUserData,
        specialCharacters: false,
      }));
    }


    // let s=e.target.value
    // var regex = /^[a-zA-Z ]{2,30}$/;
    // let a= regex.test(s);
    // if(a==false)
    // {
    //   setwrongname(true)
    //   setmessname("Name must be only string and should not contain symbols or numbers")
    // }
    // setwrongname(!a)
    // return a;
  }

  //email section 

  function checkforemailid(s) {
    onErrorText("email")
    setwronginformation(false);
    s = s.replace(/\s+/g, '');
    setemail(s);
    if (s.length == 0) {
      setemailcontrol((prevUserData) => ({
        ...prevUserData,
        wrongemail: false,
      }));
      return
    }
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let a = regex.test(s);
    if (a) {
      setemailcontrol((prevUserData) => ({
        ...prevUserData,
        wrongemail: true,
      }));
    }
    else {
      setemailcontrol((prevUserData) => ({
        ...prevUserData,
        wrongemail: false,
      }));
    }
  }

  //password section

  function containsUppercase(str) {
    return /[A-Z]/.test(str);
  }

  function containsLowercase(str) {
    return /[a-z]/.test(str);
  }

  function containsDigit(str) {
    return /\d/.test(str);
  }

  function containsSpecialCharacter(str) {
    return /[^\w\d]/.test(str);
  }

  function checkpassword(s) {
    onErrorText("password")
    setwronginformation(false);
    s = s.replace(/\s+/g, '');
    setpassword(s);
    checkconfirmpasswordIsEqualPassword(confirmpassword, s);
    if (s.length == 0) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        uppercase: false,
        lowercase: false,
        digit: false,
        specialCharacters: false,
        len: false
      }));
      return
    }

    if (containsUppercase(s) == true) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        uppercase: true,
      }));
    } else {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        uppercase: false,
      }));
    }

    if (containsLowercase(s) == true) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        lowercase: true,
      }));
    } else {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        lowercase: false,
      }));
    }

    if (containsDigit(s) == true) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        digit: true,
      }));
    } else {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        digit: false,
      }));
    }

    if (containsSpecialCharacter(s) == true) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        specialCharacters: true,
      }));
    } else {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        specialCharacters: false,
      }));
    }

    if (s.length >= 8 && s.length <= 15) {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        len: true,
      }));
    } else {
      setpasswordcontrol((prevUserData) => ({
        ...prevUserData,
        len: false,
      }));
    }
  }

  //address section

  function extractMobileNumber(inputString) {
    const regex = /\b\d{10}\b/g;
    const matches = inputString.match(regex);
    if (matches && matches.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function inableconfirmpassword() {
    setconfirmpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      isPasswordandconfirmPasswordIsSame: false
    }));
  }

  function disabledconfirmpassword() {
    setconfirmpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      isPasswordandconfirmPasswordIsSame: true
    }));
  }

  //check confirm password

  function checkconfirmpasswordIsEqualPassword(confirmpassword, password) {
    if (confirmpassword.length == 0) {
      inableconfirmpassword()
    }
    else if (confirmpassword == password) {
      disabledconfirmpassword()
    }
    else {
      inableconfirmpassword()
    }
  }

  function checkconfirmpassword(data) {
    onErrorText("confirmpassword")
    setwronginformation(false);
    setconfirmpassword(data)
    checkconfirmpasswordIsEqualPassword(data, password)
  }

  //validate OTP

  function checkotp(data) {
    setotp((prevUserData) => ({
      ...prevUserData,
      otpFromdata: data,
    }));
  }

  function checkAllInputfield() {
    return (namecontrol.charcter && namecontrol.word && namecontrol.lenWord && namecontrol.len && namecontrol.specialCharacters
      && emailcontrol.wrongemail && passwordcontrol.uppercase && passwordcontrol.lowercase && passwordcontrol.digit && passwordcontrol.len && passwordcontrol.specialCharacters &&
      confirmpasswordcontrol.isPasswordandconfirmPasswordIsSame)

  }

  function disabledinputfrom() {
    setnamecontrol((prevUserData) => ({
      ...prevUserData,
      shownamefrom: true
    }));
    setemailcontrol((prevUserData) => ({
      ...prevUserData,
      showemailfrom: true
    }));
    setpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      showpasswordfrom: true
    }));
    setconfirmpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      showconfirmpasswordfrom: true
    }));
  }

  function inableinputfrom() {
    setnamecontrol((prevUserData) => ({
      ...prevUserData,
      shownamefrom: false
    }));
    setemailcontrol((prevUserData) => ({
      ...prevUserData,
      showemailfrom: false
    }));
    setpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      showpasswordfrom: false
    }));
    setconfirmpasswordcontrol((prevUserData) => ({
      ...prevUserData,
      showconfirmpasswordfrom: false
    }));
  }

  function inableotpcontrol() {
    setotp((prevUserData) => ({
      ...prevUserData,
      disabledOtpForm: false,
      loginbutton: false,
    }));
    setresent(false)
  }

  function disableotpcontrol() {
    setresent(true)
    setotp((prevUserData) => ({
      ...prevUserData,
      disabledOtpForm: true,
      loginbutton: true,
    }));
  }

  function OTPVerified() {
    setwronginformation(false)
    if (checkAllInputfield() == false || otp.otpFromdata == 0) {
      swal("Please Fill Input Form")
      return;
    }
    disableotpcontrol()
    fetch(`${api}/Verification/VerifyOTP`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        otp: otp.otpFromdata,
        name: name,
        email: email,
        password: password,
      })
    })
      .then(response => response.json())
      .then((result) => {
        if (result.statusCode == 200 || result.statusCode == 201) {
          swal("SuccessFully Register")
          history('/Login')
        }
        else {
          inableotpcontrol()
          setwronginformation(true)
          setmesswronginformation(result.message)
        }
      }, (error) => {
        inableotpcontrol()
        setwronginformation(true)
        setmesswronginformation("Some Error is Found")
      })
  }

  function SendOTP() {
    onErrorText("")
    if (checkAllInputfield()) {
      setwronginformation(false)
      disabledinputfrom()
      setdisabled(true)
      disableotpcontrol()
      fetch(`${api}/Verification/otp-send`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
        })
      })
        .then(response => response.json())
        .then((result) => {
          if (result.statusCode == 200) {
            setregisterandloginlink(false)
            swal(result.message)
            setotp((prevUserData) => ({
              ...prevUserData,
              showOtpfrom: true,
              showOtpButton: true,
              disabledOtpForm: false,
              loginbutton: false,
            }));
            setresent(false)
          }
          else {
            inableinputfrom()
            setwronginformation(true);
            setmesswronginformation(result.message)
            setresent(false)
            setdisabled(false)
          }
        }).catch(() => {
          inableinputfrom()
          setwronginformation(true);
          setmesswronginformation("we find some error Please Try Again Later")
          setresent(false)
          setdisabled(false)
        })
    }
    else {
      swal("Please Fill All the filed using The Description")
    }
  }

  return (
    <div className="authform">
      <h4 >Register</h4>

      <div className="">
        <input type="text" value={name} onChange={(e) => checkforname(e)} disabled={namecontrol.shownamefrom} className="inputreglog" placeholder="Enter Full Name" required />
        {namecontrol.charcter && namecontrol.word && namecontrol.lenWord && namecontrol.len && namecontrol.specialCharacters && <HiCheckCircle style={{ color: 'green' }} />}
      </div>
      {namecontrol.show_name_error_text == true &&
        <div>
          <div className="authform">
            <>
              <label className="wrongtext">{namecontrol.charcter == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />} FullName Must not be Contain Number</label>
              <label className="wrongtext">{namecontrol.word == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  FullName Must be Minimum Two Word</label>
              <label className="wrongtext">{namecontrol.lenWord == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Length of Each word Greater then one</label>
              <label className="wrongtext">{namecontrol.len == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Length of FullName in Between 6 to 20</label>
              <label className="wrongtext">{namecontrol.specialCharacters == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Avoid Numbers and Special Characters</label>
            </>
          </div>
        </div>
      }


      <div className="">
        <input type="email" value={email} onChange={(e) => { checkforemailid(e.target.value) }} disabled={emailcontrol.showemailfrom} className="inputreglog" placeholder="Enter Email Id" required />
        {emailcontrol.wrongemail && <HiCheckCircle style={{ color: 'green' }} />}
      </div>
      {emailcontrol.show_email_error_text == true &&
        <div>
          <>
            <label className="wrongtext">{emailcontrol.wrongemail == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Email Address must be in valid formate with @ symbol</label>
          </>
        </div>
      }


      <div className="">
        <input type="password" value={password} onChange={(e) => { checkpassword(e.target.value) }} disabled={passwordcontrol.showpasswordfrom} className="inputreglog" placeholder="Enter Password" required />
        {passwordcontrol.uppercase && passwordcontrol.lowercase && passwordcontrol.digit && passwordcontrol.len && passwordcontrol.specialCharacters && <HiCheckCircle style={{ color: 'green' }} />}
      </div>
      {passwordcontrol.show_password_error_text &&
        <div>
          <div className="authform">
            <>
              <label className="wrongtext">{passwordcontrol.uppercase == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />} Password Must be one Upper case Character</label>
              <label className="wrongtext">{passwordcontrol.lowercase == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}   Password Must be one Lower case Character</label>
              <label className="wrongtext">{passwordcontrol.digit == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Password Must be Contain one Digit Character</label>
              <label className="wrongtext">{passwordcontrol.specialCharacters == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Password Must be  one Special Character </label>
              <label className="wrongtext">{passwordcontrol.len == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Length of Password at Least 8 to 15 Character</label>
            </>
          </div>
        </div>
      }


      <div className="">
        <input type="password" value={confirmpassword} onChange={(e) => { checkconfirmpassword(e.target.value) }} disabled={confirmpasswordcontrol.showconfirmpasswordfrom} className="inputreglog" placeholder="Enter confirm Password" required />
        {confirmpasswordcontrol.isPasswordandconfirmPasswordIsSame && <HiCheckCircle style={{ color: 'green' }} />}
      </div>

      {confirmpasswordcontrol.show_confirmpassword_error_text == true &&
        <div>
          <div className="authform">
            <>
              <label className="wrongtext">{confirmpasswordcontrol.isPasswordandconfirmPasswordIsSame == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />} Password and Confirmpassword Must be Same</label>
            </>
          </div>
        </div>
      }

      <div className="">
        {
          otp.showOtpfrom &&
          <>
            <input type="number" value={otp.otpFromdata} onChange={(e) => { checkotp(e.target.value) }} style={{ width: "260px" }} disabled={otp.disabledOtpForm} className="inputreglog" placeholder="Enter OTP" required />
            <button onClick={SendOTP} disabled={resent} className="btn btn-info btn-sm">Resent</button>
          </>
        }
      </div>
      {wronginformation && <label className="wrongtext" style={{ color: "red" }}><GoXCircleFill /> {messwronginformation}</label>}


      {otp.showOtpButton == true ? <button className="btn btn-info btn-sm" disabled={otp.loginbutton} onClick={OTPVerified}>Register</button> :
        <button className="btn btn-info btn-sm" disabled={disabled} onClick={SendOTP}>Send OTP</button>}

      {registerandloginlink && <p className="mt-3">Already have an account? <Link style={{textDecoration:'none'}} to={'/Signin'}>Sing in</Link></p>}
    </div>
  )
}

export default Register;