const Order = require('../model/order');
const Cart = require('../model/cart');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { items } = req.body;

    console.log(`Creating order for user ${userId} with items:`, items);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in the order' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: userId,
      items,
      total,
      status: 'new'
    });

    const savedOrder = await order.save();

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    } else {
      console.warn(`No cart found for user ${userId} to clear after order creation.`);
    }

    // Transform Mongo _id to id for frontend compatibility
    const transformedOrder = {
      id: savedOrder._id.toString(),
      status: savedOrder.status,
      total: savedOrder.total,
      items: savedOrder.items,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
    };

    res.status(201).json(transformedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log(`Updating order ${orderId} to status ${status}`);
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};