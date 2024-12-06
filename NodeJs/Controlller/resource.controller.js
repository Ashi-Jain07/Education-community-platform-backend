import ResourceModel from "../Model/resource.model.js";

// Get all resources with filters and search
export async function getResource(req, res) {
    const { category, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    try {
        const resources = await ResourceModel.find(query);
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch resources" });
    }
};

// Add a new resource
export async function addResource(req, res) {
    const { title, description, category, url } = req.body;

    try {
        const resource = new ResourceModel({ title, description, category, url });
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Failed to add resource" });
    }
}

// Bookmark a resource
export async function bookmarkResource(req, res) {
    const { userId } = req.body; // Pass the userId of the logged-in user
    const { id } = req.params;

    try {
        const resource = await ResourceModel.findById(id);
        if (!resource) return res.status(404).json({ error: "Resource not found" });

        if (!resource.bookmarks.includes(userId)) {
            resource.bookmarks.push(userId);
            await resource.save();
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Failed to bookmark resource" });
    }
};