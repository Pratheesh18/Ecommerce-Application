import React , {useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface UserProfile{
    firstName:string;
    lastName : string;
    userName :string;
    email : string;
}


const Dashboard : React.FC = () => {

    const navigate = useNavigate();

    const [user,setUser] = useState <UserProfile | null>(null);

    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');

        if(accessToken){
            console.log("Access Token " , accessToken);
            axios.get('http://localhost:5000/api/auth/profile',{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            }).then((response) => {
                console.log("Profile Response " , response.data);
                setUser(response.data.user)
            }).catch((error) => {
                console.error('Error fetching profile',error);
                if(error.response && error.response.status === 403){
                    console.log('Invalid or expired token');
                    navigate('/login');
                }
            });
        }else{
            console.log("No access token found ")
            navigate('/login');
        }
    },[navigate]);

    if(!user){
        return <p> User Loading ! </p>
    }


    return(
        <>
           <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
                <h2 className='text-2xl font-bold text-center mb-6'> User Profile </h2>
                <div className='mb-4'>
                    <strong> First Name :  </strong> {user.firstName}
                </div>
                <div className='mb-4'>
                    <strong> Last Name : </strong> {user.lastName}
                </div>
                <div className='mb-4'>
                    <strong> Username :  </strong> {user.userName}
                </div>
                <div className='mb-4'>
                    <strong> Email :  </strong> {user.email}
                </div>
            </div>
           </div>
        </>
    )
};


export default Dashboard;