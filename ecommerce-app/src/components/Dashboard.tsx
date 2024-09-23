    import React , {useState,useEffect,useMemo} from 'react';
    import { Button , Dialog , DialogActions,DialogContent,DialogTitle,Typography, Grid, Card, CardMedia, CardContent, CardActions , TextField  } from '@mui/material';
    import AddProduct from './AddProduct';
    import axios from 'axios';
    import LazyLoad from 'react-lazyload';

    interface Product { //defining a shape of an object
        _id:string;
        name : string;
        price : number;
        image:string;
    }

    const Dashboard : React.FC = () => {
        const [open,setOpen] = useState(false);
        const [products,setProducts] = useState<Product[]>([]);
        const [searchTerm,setSearchTerm] = useState<string>('');
        const [currentPage , setCurrentPage] = useState<number>(1);
        const [totalPages,setTotalPages] = useState<number>(1);


        
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

        const fetchProducts = async (page:number) => {
            try{
                const response = await axios.get('http://localhost:5000/api/products/getAll',{
                    params : {page},
                });
                console.log("API response" , response.data);
                const products = response.data.products;
                const totalPages = response.data.totalPages;

                console.log("Product",products)
                console.log("Pages",totalPages);

                setProducts(products);
                setTotalPages(totalPages);
              
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
            fetchProducts(currentPage);
        },[currentPage]);

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


        const filteredProducts = useMemo(() => {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log("Filtered Products:", filtered); 
            return filtered;
        }, [products, searchTerm]);

        const handleNextPage = () => {
            if(currentPage < totalPages){
                setCurrentPage((prevPage) => prevPage + 1);
            }
        };

        const handlePreviousPage = () => {
            if(currentPage > 1){
                setCurrentPage((prevPage) => prevPage - 1);
            }
        };
    

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
                                    <LazyLoad height={200} offset={100}>
                                         <CardMedia component="img" height="200" style={{objectFit:'cover'}} image={`http://localhost:5000${product.image}`} loading='lazy' alt={product.name} />
                                    </LazyLoad>
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
                        <div className='flex justify-between mt-4'>
                            <Button disabled={currentPage === 1} onClick={handlePreviousPage}>
                                Previous
                            </Button>
                            <Typography>
                                Page {currentPage} of {totalPages}
                            </Typography>
                            <Button disabled={currentPage === totalPages} onClick={handleNextPage}>
                                Next
                            </Button>
                        </div>
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