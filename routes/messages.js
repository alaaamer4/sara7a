const express = require("express");
const router = express.Router();
// import Model
const Message = require("../models/Message");

//@ method GET
// @ get all messages
// @ route   /api/messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log(error.message);
  }
});
//@ method POST
// @ create new message
// @ route   /api/messages
router.post("/", async (req, res) => {
  try {
    const message = await Message.create(req.body);
    if (!message) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@ method PUT
// @update (edit) a message
// @ route   /api/messages/:id
router.put("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!message) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@ method DELETE
// @delete (remove) a message
// @ route   /api/messages/:id
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.log(error.message);
  }
});
//@ method GET
// @get a single message
// @ route   /api/messages/:id
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
