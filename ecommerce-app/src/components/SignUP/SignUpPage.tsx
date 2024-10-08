import React , {useState} from 'react';
import {useForm,SubmitHandler} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import {toast} from 'react-toastify';
import { Link , useNavigate } from 'react-router-dom';
import {Icon} from 'react-icons-kit'
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';

interface SignUpFormData{
    firstName : string;
    lastName : string;
    userName : string;
    email : string;
    password : string;
    confirmPassword : string;
}

const schema = yup.object().shape({
    firstName : yup.string().required('First Name is required'),
    lastName : yup.string().required('Last Name is required'),
    userName : yup.string().required('Username is required'),
    email : yup.string().email('Invalid Email').required('Email is required'),
    password:yup.string().min(6,'Password must be atleast 6 characters').required('Password is required'),
    confirmPassword:yup.string().oneOf([yup.ref('password')],'Passwords must match').required('Confirm password is required'),
});

const SignUpPage : React.FC = () => {
    const {register,handleSubmit,formState:{errors}} = useForm<SignUpFormData>({resolver:yupResolver(schema)});
    const navigate = useNavigate();
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const onSubmit : SubmitHandler<SignUpFormData> = async (data) => {
        try{
            await axios.post('http://localhost:5000/api/auth/register',data);
            console.log("Sign Up data",data);
            toast.success('Registration Successful' , {position:'bottom-right'})
            navigate('/login');
        }catch(error){
            console.error("Error during registration",error);
            toast.error('Error in Registration ',{position:'bottom-right'});    
        }

    }
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return(
       <>
          <div className="flex justify-center items-center h-screen bg-gray-100">
             <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded">
                <h2 className="flex justify-center text-2xl font-bold mb-6 text-blue-500">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex-1 min-w-[200px]">
                         <label className="block text-sm font-medium mb-2">First Name</label>
                         <input
                            type="text"
                            {...register('firstName')}
                            className="w-full px-4 py-2 border rounded"
                         />
                         {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                           <label className="block text-sm font-medium mb-2">Last Name</label>
                            <input
                                type="text"
                                {...register('lastName')}
                                className="w-full px-4 py-2 border rounded"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                {...register('userName')}
                                className="w-full px-4 py-2 border rounded"
                            />
                            {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full px-4 py-2 border rounded"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                      </div>
                      </div>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex-1 min-w-[200px] relative">
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                className="w-full px-4 py-2 border rounded"
                            />
                            <span className='absolute right-4 top-9 cursor-pointer' onClick={togglePasswordVisibility}>
                                <Icon icon={showPassword ? eyeOff : eye} size={20} />
                            </span>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                        <div className="flex-1 min-w-[200px] relative">
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              {...register('confirmPassword')}
                              className="w-full px-4 py-2 border rounded"
                            />
                            <span className='absolute right-4 top-9 cursor-pointer' onClick={toggleConfirmPasswordVisibility}>
                                <Icon icon={showConfirmPassword ? eyeOff : eye} size={20} />
                            </span>
                           {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                          </div>
                         </div>
                        <div className=' flex flex-col items-center justify-between space-y-4 text-right mb-4'>
                          <Link to="/login" className='text-blue-500 hover:underline'> Already Have An Account ? Login
                          </Link>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                        >
                          Sign Up
                        </button>
                </form>
              </div>
            </div>
       </>
    )

};

export default SignUpPage;