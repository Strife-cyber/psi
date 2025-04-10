import models from "../models/index.js";

/**
 * Create a new Entry
 */
export const createEntry = async (req, res) => {
    const { userId } = req.user;
    const { title, description, passwordId } = req.body;

    try {
        const password = await models.Password.findByPk(passwordId);
        if (!password) {
            return res.status(404).json({ message: "Password not found" });
        }

        const entry = await models.Entry.create({
            title,
            description,
            password: passwordId,
            user: userId
        });

        return res.status(201).json({
            message: "Entry successfully created",
            entry
        });
    } catch (error) {
        return res.status(500).json({
            error: "Could not create entry",
            stack: error
        });
    }
};

/**
 * Get all entries of a user
 */
export const getUserEntries = async (req, res) => {
    const { userId } = req.user;

    try {
        const entries = await models.Entry.findAll({
            where: { user: userId },
            include: [models.Password]  // Optional: to include password data
        });

        return res.status(200).json(entries);
    } catch (error) {
        return res.status(500).json({
            error: "Could not fetch entries",
            stack: error
        });
    }
};

/**
 * Get a single entry by ID
 */
export const getEntryById = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const entry = await models.Entry.findOne({
            where: { id, user: userId },
            include: [models.Password]
        });

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        return res.status(200).json(entry);
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching entry",
            stack: error
        });
    }
};

/**
 * Update an existing entry
 */
export const updateEntry = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;
    const { title, description, passwordId } = req.body;

    try {
        const entry = await models.Entry.findOne({
            where: { id, user: userId }
        });

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        if (passwordId) {
            const password = await models.Password.findByPk(passwordId);
            if (!password) {
                return res.status(404).json({ message: "Password not found" });
            }
            entry.password = passwordId;
        }

        entry.title = title || entry.title;
        entry.description = description || entry.description;

        await entry.save();

        return res.status(200).json({
            message: "Entry updated successfully",
            entry
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error updating entry",
            stack: error
        });
    }
};

/**
 * Delete an entry
 */
export const deleteEntry = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const deleted = await models.Entry.destroy({
            where: { id, user: userId }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Entry not found or already deleted" });
        }

        return res.status(200).json({
            message: "Entry deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error deleting entry",
            stack: error
        });
    }
};
