import axios from 'axios';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID; // Replace with your own client ID
const clientSecret = import.meta.env.VITE_PAYPAL_CLIENT_SECRET; // Replace with your own client secret
const baseUrl = 'https://api.sandbox.paypal.com'; // Change to live environment


async function getAccessToken(): Promise<string> {
    const response = await axios.post(`${baseUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
        username: clientId,
        password: clientSecret
    }
    });

    return response.data.access_token;
}

export async function createOrder(amount: string, currency: string, payeeEmail: string): Promise<string> {
    const accessToken = await getAccessToken();

    const response = await axios.post(`${baseUrl}/v2/checkout/orders`, {
        intent: 'CAPTURE',
        purchase_units: [{
        amount: {
            currency_code: currency,
            value: amount
        },
        payee: {
            email_address: payeeEmail
        }
        }]
    }, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        }
    });

    return response.data.id;
}

export async function captureOrder(orderID: string): Promise<any> {
    const accessToken = await getAccessToken();

    const response = await axios.post(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {}, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        }
    });

    return response.data;
}