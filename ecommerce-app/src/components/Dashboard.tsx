    import React , {useState,useEffect} from 'react';
    import { Button , Dialog , DialogActions,DialogContent,DialogTitle,Typography, Grid, Card, CardMedia, CardContent, CardActions  } from '@mui/material';
    import AddProduct from './AddProduct';
    import axios from 'axios';

    interface Product {
        _id:string;
        name : string;
        price : number;
        image:string;
    }

    const Dashboard : React.FC = () => {
        const [open,setOpen] = useState(false);
        const [products,setProducts] = useState<Product[]>([]);


        
        const handleOpen = () => {
            setOpen(true);
        }

        const handleClose = () => {
            setOpen(false);
        }

        const handleFormSubmit = () => {
            handleClose();
            fetchProducts();

        }

      

        const fetchProducts = async () => {
            try{
                const response = await axios.get('http://localhost:5000/api/products/getAll');
                setProducts(response.data);
                console.log("Product",response.data)
            }catch(error){
                console.error('Error fetching products',error);
            }
        };

        const handleDelete = async (productId:string) => {
            try{
                await axios.delete(`http://localhost:5000/api/products/delete/${productId}`);
                setProducts(products.filter(product => product._id !== productId))
            }catch(error){
                console.error('Error deleting product ',error);
            }
        };

        useEffect(() => {
            fetchProducts();
        },[])
    

        return(
            <>
            <div className='min-h-screen bg-gray-100 p-4'>
                <div className='w-full max-w-4xl mx-auto'>
                    <div className='flex justify-between items-center mb-6'>
                        <Typography variant='h4' component="h2" color='primary'>
                            Dashboard
                        </Typography>
                        <Button variant='contained' color='primary' onClick={handleOpen}>
                            Add Product
                        </Button>
                    </div>
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <Card>
                                    <CardMedia component="img" height="140" width="150" image={`http://localhost:5000${product.image}`} alt={product.name} />
                                    <CardContent>
                                        <Typography variant="h6"> {product.name} </Typography>
                                        <Typography variant='body2' color="textSecondary">
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button color='error' onClick={() => handleDelete(product._id)}>
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
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