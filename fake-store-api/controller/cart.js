const Cart = require('../model/cart');
const Product = require('../model/product');

// Helper function to get user's cart or create if doesn't exist
const getOrCreateUserCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    cart = new Cart({
      userId,
      products: []
    });
    await cart.save();
  }
  
  return cart;
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await getOrCreateUserCart(req.id);
    
    // Populate product details
    const populatedCart = await Cart.populate(cart, {
      path: 'products.productId',
      select: 'title price image'
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
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to create or update product
const upsertProduct = async (productData) => {
  const { id, title, price, image, description, category } = productData;
  
  return await Product.findOneAndUpdate(
    { id },
    { title, price, image, description, category },
    { upsert: true, new: true }
  );
};

exports.updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }

    // Process each product
    const processedProducts = [];
    for (const item of products) {
      if (!item.product || !item.product.id || !item.quantity) {
        return res.status(400).json({ message: 'Each item must have product details and quantity' });
      }

      // Create or update the product
      const product = await upsertProduct(item.product);
      
      processedProducts.push({
        productId: product._id,
        quantity: item.quantity
      });
    }

	// Fetch the user details from database
	if (!req.id) {
	  return res.status(401).json({ message: 'Unauthorized' });
	}
	

    // Update the cart
    const cart = await Cart.findOneAndUpdate(
      { userId: req.id },
      { 
        products: processedProducts,
        date: new Date()
      },
      { new: true, upsert: true }
    ).populate({
      path: 'products.productId',
      select: 'id title price image description category'
    });

    // Prepare the response
    const response = {
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: cart.products.map(item => ({
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
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
