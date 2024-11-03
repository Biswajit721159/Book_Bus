const Message = require("../models/Message");
exports.createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

exports.fetchMessage = async (req, res) => {
    try {
        const Messages = await Message.find();
        res.status(200).json({ message: 'Message deleted successfully', data: Messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};