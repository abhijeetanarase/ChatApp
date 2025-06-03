import Message from "../models/message.js";

const getMessages = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const messages = await Message.find({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id },
      ],
    });
    res.json(messages);
  } catch (error) {
    console.log("Error to fetching messages", error);
  }
};

export {getMessages}
