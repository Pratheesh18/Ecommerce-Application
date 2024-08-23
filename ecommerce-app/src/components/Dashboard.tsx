import React , {useState} from 'react';
import { Button , Dialog , DialogActions,DialogContent,DialogTitle,Typography } from '@mui/material';
import AddProduct from './AddProduct';


const Dashboard : React.FC = () => {
    const [open,setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleFormSubmit = () => {
        handleClose();
    }

    return(
        <>
           <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
            <div className='w-full max-w-md bg-white shadow-md rounded-lg p-6'>
                <Typography variant='h4' component="h2" align='center' gutterBottom color='primary'>
                    Dashboard
                </Typography>
                <Button variant='contained' color='primary' onClick={handleOpen} fullWidth >
                    Add Product
                </Button>
            </div>
           </div>
           <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Add Product </DialogTitle>
            <DialogContent>
                <AddProduct onSubmitSuccess={handleFormSubmit} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='error'>
                    Cancel
                </Button>
            </DialogActions>
           </Dialog>
        </>
    )
};


export default Dashboard;