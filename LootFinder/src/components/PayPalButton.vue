<!-- filepath: src/components/PayPalButton.vue -->

<template>
    <div ref="paypalButtonContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { createOrder, captureOrder } from '../paypalService';

declare const paypal: any;

export default defineComponent({
    name: 'PayPalButton',
    props: {
        amount: {
        type: String,
        required: true
        },
        currency: {
        type: String,
        required: true
        },
        payeeEmail: {
        type: String,
        required: true
        }
    },
    setup(props) {
    const paypalButtonContainer = ref<HTMLDivElement | null>(null);

    onMounted(() => {
        if (paypalButtonContainer.value) {
            paypal.Buttons({
            createOrder: async () => {
                try {
                const orderID = await createOrder(props.amount, props.currency, props.payeeEmail);
                return orderID;
                } catch (error) {
                console.error('Error creating order:', error);
                }
            },
            onApprove: async (data: { orderID: string }) => {
                try {
                const capture = await captureOrder(data.orderID);
                console.log('Capture result:', capture);
                alert('Transaction completed by ' + capture.payer.name.given_name);
                } catch (error) {
                console.error('Error capturing order:', error);
                }
            },
            onError: (err: any) => {
                console.error('Error during PayPal transaction:', err);
            }
            }).render(paypalButtonContainer.value);
        }
    });

    return {
        paypalButtonContainer
    };
    }
});
</script>