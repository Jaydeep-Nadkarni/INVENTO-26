import Notice from "../models/noticeModel.js";

export const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNotice = async (req, res) => {
    try {
        const { title, content, type, category } = req.body;
        const newNotice = await Notice.create({ title, content, type, category });
        res.status(201).json({ success: true, data: newNotice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
