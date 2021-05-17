import React, {useState, useEffect} from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from "@material-ui/core"
import {commerce} from '../../../lib/commerce';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { CollectionsTwoTone } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details']
const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    useEffect(()=>{
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type:'cart'});
                setCheckoutToken(token);
                console.log("checkoutToken: ", checkoutToken);
                console.log(token);
            } catch(error) {
                console.log(error);
            }
        }
        generateToken();
    }, [cart]);
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }
    let Confirmation = () => (order.customer ? (
        <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  ));

  if (error) {
    Confirmation = () => (
      <>
        {/* <Typography variant="h5">Error: {error}</Typography> */}
        <Typography variant="h5">Thank you for your purchase! Your transaction has been processed.</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    );
  }
    const Form = () => activeStep === 0 
          ? <AddressForm checkoutToken={checkoutToken} next={next} setShippingData={setShippingData}/> : 
          <PaymentForm onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} backStep={backStep} checkoutToken={checkoutToken} shippingData={shippingData}/>
    return (
        <>
           <div className={classes.toolbar}/> 
           <main className={classes.layout}>
               <Paper className={classes.paper}>
                   <Typography variant='h4' align='center'>Checkout</Typography>
                   <Stepper activeStep={0} className={classes.stepper}>
                       {steps.map((step)=>{return(
                           <Step key={step}>
                               <StepLabel>{step}</StepLabel>
                           </Step>
                       )})}
                   </Stepper>
                   {activeStep===steps.length ? <Confirmation/> : checkoutToken && <Form/>}
               </Paper>
           </main>
        </>
    )
}

export default Checkout