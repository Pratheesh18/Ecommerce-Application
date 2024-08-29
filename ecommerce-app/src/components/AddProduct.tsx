import React , {useState} from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Button , TextField , Input } from '@mui/material';
import { toast } from 'react-toastify';


interface ProductFormData {
    name : string;
    price : number;
    quantity : number;
    image : FileList;
}

interface AddProductProps {
    onSubmitSuccess : () => void;
}

const ProductSchema = yup.object().shape({
    name : yup.string().required('Product name is required'),
    price : yup.number().positive('Price must be a positive number').required('Price is required'),
    quantity : yup.number().positive('Quantity must be a positive number').required('Price is required'),
    image:yup
          .mixed<FileList>()
          .required('Image is required')
          .test('fileSize','File size is too large',(value) => {
            if(!value || !(value instanceof FileList)) return false;
            const file = value[0];
            return  file.size <= 2000000;
          })
          .test('fileType','Unsupported File Format',(value) => {
            if(!value || !(value instanceof FileList)) return false;
            const file = value[0];
            return ['image/jpeg','image/png','image/gif'].includes(file.type);
          })
});

const AddProduct : React.FC<AddProductProps> = ({onSubmitSuccess}) => {
      const [isSubmitting , setIsSubmitting] = useState(false);

      const {register , handleSubmit , formState:{errors}} = useForm<ProductFormData>({resolver:yupResolver(ProductSchema)});

      const onSubmit = async (data:ProductFormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name',data.name);
        formData.append('price',data.price.toString());
        formData.append('quantity',data.quantity.toString());
        formData.append('image',data.image[0]);

        try{
          await axios.post('http://localhost:5000/api/products/add',formData,{
            headers:{
              'Content-Type' : 'multipart/form-data',
            },
          });
          toast.success('Product added successfully !',{position:'bottom-right'});
          onSubmitSuccess();
        }catch(error){
          console.error('Error adding product',error);
          toast.error('Error adding product',{position:'bottom-right'});
        }finally{
          setIsSubmitting(false);
        }
      };

      return(
        <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className='space-y-6 p-6 bg-white rounded-lg shadow-md'>
          <div className='flex flex-col space-y-4'>
            <TextField label="Product Name" variant='outlined' fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} className='mb-4' />
            <TextField label="Price" type='number' variant='outlined' fullWidth {...register('price')} error={!!errors?.price} helperText={errors.price?.message} className='mb-4' />
            <TextField label="Quantity" type='number' variant='outlined' fullWidth {...register('quantity')} error={!!errors?.quantity} helperText={errors.quantity?.message} className='mb-4' />
            <div className='flex flex-col'>
              <Input type='file' {...register('image')} fullWidth inputProps={{accept:'image/*'}} className='mb-4' />
              {errors.image && <p className='text-red-500 text-xs italic'> {errors.image?.message} </p>}
            </div>
          </div>
          <Button variant='contained' type='submit' color='primary' disabled={isSubmitting} className='mt-2'>
            {isSubmitting ? 'Submitting...' : 'Add Product'}
          </Button>
        </form>
      )

};

export default AddProduct;