import Contact from "../models/contact.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const addToConatct = async (req, res, next) => {
  const requesterId = req.userId;
  const id = req.params.id;

  try {
    const existing = await Contact.findOne({
      requester: requesterId,
      recipient: id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User alrady in conatct", success: false });
    }
    const contact = await Contact.create({
      requester: requesterId,
      recipient: id,
      status : "accepted"
    });
    
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
  }
};

const getAllContacts = async (req, res, next) => {
  const id = req.userId;
  try {
    const contacts = await Contact.find({ requester: id }).populate(
      "recipient"
    );
    res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
  }
};

const searchUsers = async (req, res) => {
  try {
    const search = req.query.search;
    const currentUserId = req.userId;

    if (!search) return res.json([]);

    const users = await mongoose.model("User").aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(currentUserId) },
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "contacts",
          let: {
            targetUserId: "$_id",
            requesterId: new mongoose.Types.ObjectId(currentUserId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$recipient", "$$targetUserId"] },
                    { $eq: ["$requester", "$$requesterId"] },
                  ],
                },
              },
            },
          ],
          as: "contactMatch",
        },
      },
      {
        $addFields: {
          added: { $gt: [{ $size: "$contactMatch" }, 0] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          picture: 1,
          added: 1,
        },
      },
    ]);

    res.status(200).json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log("error to getting profile", error);
  }
};


const checkAuth = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.log("error to getting profile", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllContacts, addToConatct, searchUsers , getProfile , checkAuth};

