import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../Firebase.js'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../user/userSlice.js'
import { useNavigate } from 'react-router-dom'



const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGooglecClick = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth,provider)
            const res = await fetch('api/auth/google', {
                method:'POST',
                headers:{

                    'Content-Type': 'application/json',
                },
                 body:JSON.stringify({
                        name: result.user.displayName,
                        email: result.user.email,
                         photo: result.user.photoURL }),
                    })
                    const data = await res.json()
                    dispatch(signInSuccess(data));
                    navigate('/');
        } catch (error) {
            console.log("Could not sign in with google", error)
        }
    };
  return (
    <button onClick={handleGooglecClick} type='button' className='bg-red-700 text-white p-3 rounded-lg
    uppercase hover:opacity-90'>Continue with google</button>
  )
}

export default OAuth