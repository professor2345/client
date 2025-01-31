import { useSelector } from "react-redux"
import { useRef, useState , useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { updateUser } from "../../../Server/Controllers/user.controller";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../user/userSlice";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../user/userSlice";
import { use } from "react";
import { data, Link } from "react-router-dom";
import Listing from "../../../Server/Models/listing.models";

const Profile = () => {
 
  const fileRef = useRef(null)
  const {currentUser, loading , error} = useSelector((state) => state.user)
  const [formdata, setFormData]    = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const handleChange = (e) =>{
      setFormData({...formdata, [e.target.id]:e.target.value });
  };
  const [ShowListingsError , setShowListingsError] = useState(false);
  const [userListing , setUserListing] = useState([])
  useEffect(() => {
    console.log(currentUser.avatar)
  });

  const dispatch = useDispatch();
  const handleSubmit =  async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () =>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    }
    catch (error){
      dispatch(deleteUserFailure(error.message));
    }
  }


 const handleSignout = async () =>{
  try {
    dispatch(signOutUserStart());
    const res = await fetch('api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
}

const handleShowListings = async () =>{
  try {
    setShowListingsError(false);
    const res = await fetch(`/api/user/listing/${currentUser._id}`);
    const data = await res.json();
    if(data.success === false){
      setShowListingsError(true);
      return;
    }
    setUserListing(data);
  } catch (error) {
    setShowListingsError(true);
  }
}

const handleListingDelete = async (listingId)=>{
  try {
    const res = fetch(`api/listing/delete/${listingId}`,{
      method: 'DELETE',
    });
    const data = (await res).json();
    if(data.success === false){
      console.log(data.message);
      return;
    }
    setUserListing((prev) =>
    prev.filter((listing) => listing._id !== listing));
  } catch (error) {
    console.log(error.message);
  }

}

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <input type="file" ref={fileRef} hidden accept="image/*"/>
     <img onClick={()=>fileRef.current.click()} 
          src={currentUser.avatar} alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <input type="text" placeholder="username"  defaultValue={currentUser.username} id="username" className="border p-3  rounded-lg" onChange={handleChange}/>
        <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3   rounded-lg" onChange={handleChange}/>
        <input type="password" placeholder="password"  defaultValue={currentUser.password}  id="password" className="border p-3   rounded-lg"onChange={handleChange} />
        <button 
        disabled={loading}
        className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >{loading ? 'Loading...' : 'Update'}</button>
        <Link  className='bg-blue-500 text-white rounded-lg p-3
        uppercase text-center hover:opacity-95' to={'/create-listing'}>
        create Listing 
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer">
          Delete Account</span>
        <span onClick={handleSignout} className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : '' }</p>
      <p className="text-green-600">{updateSuccess ? 'user is updated successfully ' : '' }</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings </button>
      <p className="text-red-700 mt-5">{ShowListingsError ? "Error in show listing " : ""}</p>
      
      {userListing && userListing.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold">Your Listing</h1> 
      {userListing.map((listing) => (<div key={listing._id} className=" border rounded-lg p-3 flex justify-between items-center gap-4">
    <Link to={`/listing/${listing._id}`}>
   <img src={listing.imageUrls[0]} 
   alt='listing cover' 
   className="h-16 w-16 object-contain rounded-lg" 
    />
   </Link>
   <Link className="text-slate-700 font-semibold hover:underline truncate flex-1"
   to={`/listing/${listing._id}`}>
    <p>{listing.name}</p>
   
   </Link>
   <div className="flex flex-col item-center">
    <button onClick={()=>{handleListingDelete(listing._id)}} className="text-red-700 uppercase">Delete</button>
    <Link to={`/update-listing/${listing._id}`}>
    <button className="text-green-700">Edit</button>
    </Link>
   </div>

      </div>
      ))}

    </div>}
    </div>

    
  );
}

export default Profile