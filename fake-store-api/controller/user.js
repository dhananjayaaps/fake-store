const User = require('../model/user');
const bcrypt = require('bcrypt');

module.exports.getAllUser = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 0;
        const sort = req.query.sort === 'desc' ? -1 : 1;

        const users = await User.find()
            .select('-_id -__v')
            .limit(limit)
            .sort({ id: sort });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

module.exports.getUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOne({ id }).select('-_id -__v');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

module.exports.addUser = async (req, res) => {
    console.log('Request Body:', req.body);
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            message: 'data is undefined',
        });
    }

    try {
        const userCount = await User.countDocuments();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

		// check if email already exists
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}

        const user = new User({
            id: userCount + 1,
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });

        const savedUser = await user.save();
        console.log('User saved:', savedUser);
        res.json(savedUser);
    } catch (err) {
        console.error('Saving error:', err);
        res.status(500).json({ message: 'Error saving user', error: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'User id should be provided',
        });
    }

    try {
        const deletedUser = await User.findOneAndDelete({ id });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
};

module.exports.getUserProfile = async (req, res) => {
    const userId = req.id;

    try {
        const user = await User.findOne({ _id: userId }).select('-_id -__v'); // Make sure `id` is the correct field
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

module.exports.editUser = async (req, res) => {
    const userId = req.id; // From JWT token (this is the MongoDB _id)

    try {
        // Check if user exists using _id
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prepare updated data
        const updatedData = {
            email: req.body.email || user.email,
            name: req.body.name || user.name,
        };

        // Hash new password if provided
        if (req.body.password) {
            updatedData.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update user by _id and return updated document
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, // Correct query to use _id
            updatedData,
            { new: true }
        ).select('-_id -__v'); // Exclude MongoDB-specific fields

        res.json(updatedUser);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Error updating user', error: err });
    }
};