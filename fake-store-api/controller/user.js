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


module.exports.editUser = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!req.body || !id) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data or ID',
        });
    }

    try {
        const updated = await User.findOneAndUpdate(
            { id },
            {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
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
