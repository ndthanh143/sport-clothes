import axios from '../api/axios';
import {
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    CLEAR_ERRORS,
    NEW_ORDER_REQUEST,
    NEW_ORDER_FAIL,
    NEW_ORDER_SUCCESS,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
} from '../constants/orderConstants';

export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        const { data } = await axios.get('admin/orders');

        dispatch({ type: ALL_ORDERS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ALL_ORDERS_FAIL, payload: error.response.data.message });
    }
};

export const newOrder = (shippingInfo, user, orderItems, paymentInfo, notation) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ORDER_REQUEST });
        let totalPrice = 0;
        orderItems.map((item) => {
            totalPrice = totalPrice + item.price * item.quantity;
        });
        const dataOrder = {
            shippingInfo,
            user: user._id,
            orderItems,
            paymentInfo,
            totalPrice,
            notation,
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post('order/new', JSON.stringify(dataOrder), config);
        dispatch({ type: NEW_ORDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: NEW_ORDER_FAIL, payload: error.response.data.message });
    }
};

export const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const { data } = await axios.get('orders/me');
        dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
    } catch (error) {
        dispatch({ type: MY_ORDERS_FAIL, payload: error.response.data.message });
    }
};

export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        const { data } = await axios.get(`order/${id}`);
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            // payload: error.response.data.message,
            payload: error.message,
        });
    }
};

export const updateOrder = (id, orderStatusData, paymentInfoData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const orderData = {
            orderStatus: orderStatusData,
            paymentInfo: paymentInfoData,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.put(`admin/order/${id}`, JSON.stringify(orderData), config);

        dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_ORDER_FAIL, payload: error.message });
    }
};

export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        await axios.delete(`admin/order/${id}`);
        dispatch({ type: DELETE_ORDER_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_ORDER_FAIL, payload: error.message });
    }
};
