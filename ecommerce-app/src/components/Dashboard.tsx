    import React , {useState,useEffect,useMemo} from 'react';
    import { Button , Dialog , DialogActions,DialogContent,DialogTitle,Typography, Grid, Card, CardMedia, CardContent, CardActions , TextField  } from '@mui/material';
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
        const [searchTerm,setSearchTerm] = useState<string>('');


        
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
        },[]);

        const debounce = <T extends (...args:any[]) => void>(func:T,delay:number) => {
            let timeoutId : ReturnType<typeof setTimeout>;
            return (...args:Parameters<T>) => {
                if(timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func(...args);
                },delay);
            }
        };

        const handleSearch = (query:string) => {
            setSearchTerm(query);
        };

        const debouncedSearch = useMemo(() => debounce(handleSearch,300),[]);

        // const filteredProducts = useMemo(() => {
        //     if(!searchTerm) return products;
        //     return products.filter(product => {
        //         product.name.toLowerCase().includes(searchTerm.toLowerCase())
        //     })
        // },[products,searchTerm]);

        const filteredProducts = useMemo(() => {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log("Filtered Products:", filtered); // Log filtered products
            return filtered;
        }, [products, searchTerm]);
    

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
                    <TextField label="Search Products" variant='outlined' fullWidth onChange={(e) => debouncedSearch(e.target.value)} style={{display:'flex',marginBottom:'10px'}} />
                    <Grid container spacing={4}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <Card className='h-full flex flex-col justify-between'>
                                    <CardMedia component="img" height="200" style={{objectFit:'cover'}} image={`http://localhost:5000${product.image}`} loading='lazy' alt={product.name} />
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
                <DialogTitle className='flex justify-center align-center'> Add Product </DialogTitle>
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