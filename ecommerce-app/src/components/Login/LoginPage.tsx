import React , {useState} from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';


interface LoginFormData{
    email:string;
    password:string;
}

const LoginSchema = yup.object().shape({
    email : yup.string().email('Invalid email format').required('Email is required'),
    password : yup.string().min(6,'Password must be atleast 6 characters').required('Password is required'),
});



const LoginPage : React.FC = () => {
    const navigate = useNavigate();
    const [showPassword , setShowPassword] = useState(false);

    const {register,handleSubmit,formState:{errors}} = useForm<LoginFormData>({resolver:yupResolver(LoginSchema)});

    const onSubmit = async (data:LoginFormData) => {
        try{
            const res = await axios.post('http://localhost:5000/api/auth/login',data);
            sessionStorage.setItem('accessToken',res.data.accessToken);
            sessionStorage.setItem('refreshToken',res.data.refreshToken);
            toast.success('Login Successful' , {position:'bottom-right'});
            navigate(`/dashboard/${res.data.userName}`);
        }catch(error){
            console.error('Login Failed ',error);
            toast.error('Error ! Failed to Login',{position:'bottom-right'});
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return(
        <> 
           <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8'>
             <div className='w-full max-w-sm sm:max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8'>
                <h2 className='text-2xl font-bold text-center mb-6 text-blue-500 '> Login </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input type='email' id='email' {...register('email')} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`} />
                        {errors.email && <p className='text-red-500 text-xs italic'> {errors?.email?.message} </p>}
                    </div>
                    <div className='mb-6 relative'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password
                        </label>
                        <input type={showPassword ? 'text' : 'password'} id='password' {...register('password')} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500':''}`} />
                        <span className='absolute right-4 top-9 cursor-pointer' onClick={togglePasswordVisibility}>
                            <Icon icon={showPassword ? eyeOff : eye} size={20} />                        </span>
                        {errors.password && <p className='text-red-500 text-xs italice'> {errors.password.message} </p>}
                    </div>
                    <div className='flex flex-col items-center justify-between space-y-4'>
                        <Link to="/" className='text-blue-500 hover:underline w-full text-center'> Don't Have An Account ? Sign Up </Link>
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-full'> Login </button>
                      
                    </div>
                </form>
             </div>
           </div>
        </>
    )
};

export default LoginPage;