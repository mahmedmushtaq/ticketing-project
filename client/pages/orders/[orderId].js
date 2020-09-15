import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [orderPurchased, setOrderPurchased] = useState(false);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => setOrderPurchased(true),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      // this function is called automatically when component is rerender or during navigation
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  if (orderPurchased) {
    return <div>Successfully Purchased</div>;
  }

  return (
    <div>
      <div>time left to pay: {timeLeft} seconds</div>
      <br />
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HRSx1AkOwdn1iByOXQrbRALqHyPY5gE5IXJAeDPNc2G2Vu9cj4XahhtTpyLm2NEOBbILAf835KuAMMHZ7Xb9i2w00tf3CNMc7"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />

      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
