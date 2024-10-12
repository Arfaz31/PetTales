/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '../../config';
import axios from 'axios';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';

export const initiatePayment = async (paymentData: any) => {
  try {
    const response = await axios.post(config.payment_url!, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentData.transactionId,
      success_url: `http://localhost:5000/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `http://localhost:5000/api/payment/confirmation?status=failed`,
      cancel_url: 'http://localhost:5173/',
      amount: paymentData.amount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.custormerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: paymentData.customerPhone,
      type: 'json',
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment initiation failed!');
  }
};

//check if the payment is valid or not
export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: tnxId,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error('Payment validation failed!');
  }
};
