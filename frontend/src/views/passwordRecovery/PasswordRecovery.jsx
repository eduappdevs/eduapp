import React, {useState} from 'react'
import './PasswordRecovery.css'
import axios from 'axios';
import StandardModal from '../../components/modals/standard-modal/StandardModal';
export default function PasswordRecovery() {
    const urlParams = new URLSearchParams(window.location.search);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState('');
    const [customOkay, setCustomOkay] = useState(false);
    const email = urlParams.get('email');
    const token = urlParams.get('token');

    const handleChange = (e) => {
        e.preventDefault();
        switch (e.target.name) {
            case 'password':
                setPassword(e.target.value);
                break;
            case 'confirm-password':
                setConfirmPassword(e.target.value);
                break;
            default:
                break;
        }
    }
    const reset_password = (e) => {
        e.preventDefault();
        console.log({email: email, token: token, password: password, confirmPassword: confirmPassword});
        if (password === confirmPassword) {
            let http_request_url = `http://localhost:3000/password/reset?email=${email}&token=${token}&password=${password}&password_confirmation=${confirmPassword}`;
            axios.post(http_request_url).then(res => {
                if (res.data.status === 'success') {
                    setModalMessage('Password reset successfully');
                    setCustomOkay("Go to login")
                    setModalIcon('success');
                    setModalShow(true);



                } else {
                    setModalMessage('Password reset failed');
                    setModalShow(true);
                    setModalIcon('error');
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            setModalMessage('Password and confirm password does not match');
            setModalShow(true);
            setModalIcon('error');

        }

    }
    return (
        <>
            <StandardModal show={modalShow}
                text={modalMessage}
                customOkay={customOkay}
                onCloseAction={
                    () => {
                        setModalShow(false);
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 500)
                    }
                }
                hasTransition
                hasIconAnimation
                type={modalIcon}/>
            <div className="pr-container">
                <div className="pr-header">
                    <div className="pr-header-logo">
                        <img src="/assets/logo.png" alt="logo"/>
                    </div>
                    <h1>Password Recovery</h1>
                    <h2>You are about to change your password</h2>
                    <h1 className='pr-email' id='pr-email'>
                        {
                        email ? email : 'Email or token not provided'
                    }</h1>
                </div>
                <div className="pr-body">
                    <form>


                        <label htmlFor="password">New password</label>
                        <input type="password" id="password" name="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete='new-password'/>
                        <label htmlFor="password">Confirm Password</label>
                        <input type="password"
                            onChange={handleChange}
                            id="confirm-password"
                            name="confirm-password"
                            autoComplete='off'
                            placeholder="Confirm your password"/>

                        <button type="button"
                            onClick={
                                password != '' & confirmPassword != '' && reset_password
                            }
                            className="pr-button">
                            RESET
                        </button>

                    </form>
                </div>

            </div>


        </>


    )
}
