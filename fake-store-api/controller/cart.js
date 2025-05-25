const Cart = require('../model/cart');
const Product = require('../model/product');

const getOrCreateUserCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
    await cart.save();
  }
  return cart;
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await getOrCreateUserCart(req.id);
    const populatedCart = await Cart.populate(cart, {
      path: 'products.productId',
      select: 'id title price image description category'
    });

    res.json({
      id: cart.userId,
      userId: cart.userId,
      date: cart.date,
      products: populatedCart.products.map(item => ({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.image,
        description: item.productId.description,
        category: item.productId.category,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const upsertProduct = async (productData) => {
  const { id, title, price, image, description, category } = productData;
  const updatedProduct = await Product.findOneAndUpdate(
    { id: id.toString() },
    { title, price, image, description, category },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return updatedProduct;
};

exports.updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }
    if (!req.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const cart = await getOrCreateUserCart(req.id);
    const newProducts = await Promise.all(products.map(async (item) => {
      if (!item.product || !item.product.id || !item.quantity) {
        throw new Error('Each item must have product details and quantity');
      }
      const product = await upsertProduct(item.product);
      return {
        productId: product._id,
        quantity: item.quantity
      };
    }));

    // Replace entire products array
    cart.products = newProducts.filter(item => item.quantity > 0); // Exclude items with quantity <= 0
    cart.date = new Date();
    await cart.save();

    const populatedCart = await Cart.populate(cart, {
      path: 'products.productId',
      select: 'id title price image description category'
    });

    res.json({
      id: cart.userId,
      userId: cart.userId,
      date: cart.date,
      products: populatedCart.products.map(item => ({
        product: {
          id: item.productId.id,
          title: item.productId.title,
          price: item.productId.price,
          image: item.productId.image,
          description: item.productId.description,
          category: item.productId.category
        },
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }

    const cart = await Cart.findOne({ userId: req.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity <= 0) {
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    } else {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
      cart.products[productIndex].quantity = quantity;
    }

    cart.date = new Date();
    await cart.save();

    const populatedCart = await Cart.populate(cart, {
      path: 'products.productId',
      select: 'id title price image description category'
    });

    res.json({
      id: cart.userId,
      userId: cart.userId,
      date: cart.date,
      products: populatedCart.products.map(item => ({
        product: {
          id: item.productId.id,
          title: item.productId.title,
          price: item.productId.price,
          image: item.productId.image,
          description: item.productId.description,
          category: item.productId.category
        },
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};