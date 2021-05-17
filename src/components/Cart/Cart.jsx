import React from 'react';
import {Link} from "react-router-dom";
import {Container, Typography, Grid, Button} from "@material-ui/core";
import useStyles from './styles.js';
import CartItem from './CartItem/CartItem';

const Cart = ({cart, handleUpdateCartQty, handleEmptyCart, handleRemoveFromCart}) => {
    // console.log(cart)
    console.log(cart.line_items)
    const classes = useStyles();
    const EmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your shopping cart, 
            <Link to='/' className={classes.link}>start adding some</Link>!
        </Typography>
    )
    const FilledCart = () => (
        <>
        <Grid container spacing={3}>
            {cart.line_items.map((item)=>(
                <Grid item xs={12} sm={4} key={item.id}>
                    <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/>
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <Typography variant='h4'>
                Subtotal: {cart.subtotal.formatted_with_symbol}
            </Typography>
            <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary"
            onClick={handleEmptyCart}>Empty Cart</Button>
            <Button component={Link} to='/checkout' className={classes.checkoutButton} to="/checkout" size="large" type="button" variant="contained" color="primary">Checkout</Button>
        </div>
        </>
    )
    if (!cart.line_items) return "Loading..." 
    return (
        <Container>
            <div className={classes.toolbar}>
                <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>                
                {!cart.line_items.length ? <EmptyCart/> : <FilledCart/>}
            </div>            
        </Container>
    )
}

export default Cart
