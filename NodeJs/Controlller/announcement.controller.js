import announcementModel from "../Model/announcement.model.js";

//Fetch Announcement Api
export async function fetchAnnouncement(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const announcements = await announcementModel.find()
      .sort({ date: -1 }) // Sort by latest
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await announcementModel.countDocuments();

    res.json({
      data: announcements,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add a new announcement
export async function addAnnouncement(req, res) {
  const { title, content, author, date } = req.body;

  if (!title || !content || !author || !date) {
    return res.status(400).json({ message: "Fill required fields" })
  }

  try {
    const newAnnouncement = new announcementModel({ title, content, author, date });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create announcement' });
  }
};

//Delete a announcement
export function deleteAnnouncement(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(404).json({ message: "Send id of a announcement" })
  }

  announcementModel.findByIdAndDelete(id).then(data => {
    if (!data) {
      return res.status(400).json({ message: "announcement not deleted" })
    }
    res.status(200).send(data)
  }).catch(err => res.status(500).json({ message: err }))
};

//Api for update like, dislike and add comment in a database
export function UpdateLikesDislikeComment(req, res) {
  const _id = req.params.id;
  const { likes, dislikes, author, content } = req.body;

  if (!_id || (!likes && !dislikes && (!author || !content))) {
    return res.status(400).json({ message: "Send required data" });
  }

  // Build the update object dynamically to avoid overwriting with undefined
  let update = {};
  if (likes !== undefined) update.likes = likes;
  if (dislikes !== undefined) update.dislikes = dislikes;

  // If comments are provided, append the new comment
  if (author, content) {
    update.$push = { comments: { author, content } };
  }

  // Update the video document
  announcementModel.findByIdAndUpdate(_id, update, { new: true })
    .then(data => {
      if (!data) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json(data);
    })
    .catch(err => {
      console.error("Error updating:", err);
      res.status(500).json({ message: "Server error" });
    });
};

//Api for edit comment in a database
export function editComment(req, res) {
  const _id = req.params.id;
  const { content, index } = req.body;

  if (!_id || !content || index == undefined) {
    return res.status(400).json({ message: "Provide all details" })
  }

  const update = { [`comments.${index}.content`]: content };

  announcementModel.findByIdAndUpdate(_id, { $set: update }, { new: true })
    .then(data => {
      if (!data) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json(data);
    })
    .catch(err => {
      console.error("Error updating comment:", err);
      res.status(500).json({ message: "Server error" });
    });
};


//Api for delete comment from database
export function deleteComment(req, res) {
  const _id = req.params.id;
  const { index } = req.body;

  if (!_id || index === undefined) {
    return res.status(400).json({ message: "Provide announcement ID and comment index" });
  }

  announcementModel.findById(_id)
    .then(announcement => {
      if (!announcement) {
        return res.status(404).json({ message: "announcement not found" });
      }

      // Ensure the index is valid
      if (index < 0 || index >= announcement.comments.length) {
        return res.status(400).json({ message: "Invalid comment index" });
      }

      // Remove the comment at the specified index
      announcement.comments.splice(index, 1);

      // Save the updated document
      announcement.save()
        .then(updatedAnnouncement => res.status(200).json(updatedAnnouncement))
        .catch(err => {
          console.error("Error saving announcement:", err);
          res.status(500).json({ message: "Server error" });
        });
    })
    .catch(err => {
      console.error("Error finding announcement:", err);
      res.status(500).json({ message: "Server error" });
    });
};

//Api to add nested comment
export function AddNestedComment(req, res) {
  const announcementId = req.params.id;
  const { commentId, author, content } = req.body;

  // Validate input
  if (!announcementId || !commentId || !author || !content) {
    return res.status(400).json({ message: "Send required data: announcementId, commentId, author, and content" });
  }

  // Add a nested comment to the specific comment
  announcementModel.findOneAndUpdate(
    { _id: announcementId, "comments._id": commentId }, // Match announcement and specific comment
    {
      $push: { "comments.$.nestedComments": { author, content } }, // Push nested comment to matched comment's `nestedComments`
    },
    { new: true } // Return the updated document
  )
    .then((updatedAnnouncement) => {
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: "Announcement or Comment not found" });
      }
      res.status(200).json(updatedAnnouncement);
    })
    .catch((err) => {
      console.error("Error adding nested comment:", err);
      res.status(500).json({ message: "Server error" });
    });
};