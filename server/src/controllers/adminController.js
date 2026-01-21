import Admin from "../models/adminModel.js";
import { generateToken } from "../services/jwtService.js";
import Event from "../models/eventModel.js"; // To validate event IDs
import GlobalSettings from "../models/globalSettingsModel.js";

// @desc    Auth Admin & get token
// @route   POST /api/admins/login
// @access  Public
export const authAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            // Check if disabled
            if (admin.status === 'Disabled') {
                return res.status(401).json({ message: 'Account is disabled. Contact Master Admin.' });
            }

            admin.lastLogin = Date.now();
            await admin.save();

            res.json({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                access: admin.access,
                isRegistration: admin.isRegistration,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/Admin (Master only ideally, but for now any admin)
export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select("-password");
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new admin
// @route   POST /api/admins
// @access  Private/Admin
export const createAdmin = async (req, res) => {
    const { id, name, email, password, team, access, isRegistration } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Optional: Validate event IDs in 'access' array
        if (access && access.length > 0) {
            // Can add logic here to verify these IDs correspond to real events
        }

        const admin = await Admin.create({
            id, // Custom ID passed from frontend (ADM-00X)
            name,
            email,
            password,
            team,
            access,
            isRegistration
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                id: admin.id,
                name: admin.name,
                email: admin.email,
                access: admin.access,
                isRegistration: admin.isRegistration
            });
        } else {
            res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/Admin
export const updateAdmin = async (req, res) => {
    const { id } = req.params; // This is the mongo _id or the custom id? Usually params are _id. 
    // But frontend might send custom ID. Let's assume _id for REST standard, or search by custom ID if needed.
    // Actually, let's search by _id if possible, or handle both.

    try {
        const admin = await Admin.findById(id);

        if (admin) {
            admin.name = req.body.name || admin.name;
            admin.email = req.body.email || admin.email;
            admin.team = req.body.team || admin.team;
            admin.status = req.body.status || admin.status;

            if (req.body.password) {
                admin.password = req.body.password;
            }

            if (req.body.access !== undefined) {
                admin.access = req.body.access;
            }

            if (req.body.isRegistration !== undefined) {
                admin.isRegistration = req.body.isRegistration;
            }

            const updatedAdmin = await admin.save();

            res.json({
                _id: updatedAdmin._id,
                id: updatedAdmin.id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                access: updatedAdmin.access,
                status: updatedAdmin.status,
                isRegistration: updatedAdmin.isRegistration
            });
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get global settings
// @route   GET /api/admins/settings/global
// @access  Private/Admin
export const getGlobalSettings = async (req, res) => {
    try {
        const settings = await GlobalSettings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update global settings
// @route   PUT /api/admins/settings/global
// @access  Private/Admin (Master only ideally)
export const updateGlobalSettings = async (req, res) => {
    try {
        const { passControl, registrationsOpen } = req.body;
        const settings = await GlobalSettings.getSettings();

        if (passControl !== undefined) settings.passControl = passControl;
        if (registrationsOpen !== undefined) settings.registrationsOpen = registrationsOpen;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

