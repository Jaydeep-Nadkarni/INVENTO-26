import Volunteer from "../models/volunteerModel.js";

// Login Volunteer
export const loginVolunteer = async (req, res) => {
    try {
        const { email, accessId } = req.body;

        // Normalize input
        const emailLower = email.toLowerCase().trim();
        const idTrim = accessId.trim();

        const volunteer = await Volunteer.findOne({
            email: emailLower,
            accessId: idTrim
        });

        if (!volunteer) {
            return res.status(401).json({ message: "Invalid credentials. Access Denied." });
        }

        return res.status(200).json({
            message: "Access Granted",
            volunteer: {
                id: volunteer._id,
                name: volunteer.name,
                email: volunteer.email,
                accessId: volunteer.accessId,
                createdAt: volunteer.createdAt,
                updatedAt: volunteer.updatedAt
            }
        });

    } catch (error) {
        console.error("Volunteer Login Error:", error);
        return res.status(500).json({ message: "Server Verification Error" });
    }
};
