import masjidModel from "../../models/Masjid/Masjid.js";
import express from "express";

const router = express.Router();

// Get all masjids
router.get("/getall", async (req, res) => {
  try {
    const getall = await masjidModel.find({});
    res.status(200).json(getall);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Get a single masjid by ID
router.get("/getone/:id", async (req, res) => {
  try {
    const params = req.params.id;
    const getone = await masjidModel.findOne({ _id: params });
    res.status(200).json(getone);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Update masjid data by ID
router.put("/update/:id", async (req, res) => {
  try {
    const userinput = req.body;
    const params = req.params.id;
    await masjidModel.updateOne({ _id: params }, { $set: userinput });
    res.status(200).json({ msg: "Masjid data updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Delete one masjid by ID
router.delete("/deleteone/:id", async (req, res) => {
  try {
    const params = req.params.id;
    await masjidModel.deleteOne({ _id: params });
    res.status(200).json({ msg: "Masjid deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Delete all masjids
router.delete("/deleteall", async (req, res) => {
  try {
    await masjidModel.deleteMany({});
    res.status(200).json({ msg: "All masjids deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Add or update a masjid (Prevents duplicate masjidId error)
router.post("/addmasjid", async (req, res) => {
  try {
    const { masjidName, masjidArea, masjidTime, location, photos } = req.body;

    // Find the latest masjidId and increment it
    const lastMasjid = await masjidModel.findOne().sort({ masjidId: -1 }); // Get the highest masjidId
    const newMasjidId = lastMasjid ? lastMasjid.masjidId + 1 : 1; // If no masjids exist, start from 1

    // Insert new masjid with auto-incremented masjidId
    const newMasjid = await masjidModel.create({
      masjidId: newMasjidId,
      masjidName,
      masjidArea,
      masjidTime,
      location,
    });

    res.status(200).json({ msg: "Masjid added successfully", data: newMasjid });
  } catch (error) {
    console.error("Error adding masjid:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Bulk insert masjids with unique masjidId for each
router.post("/bulk", async (req, res) => {
  try {
    const masjidCount = await masjidModel.countDocuments(); // Get total count
    const bulkMasjids = req.body.map((masjid, index) => ({
      masjidId: masjidCount + index + 1, // Assign unique ID sequentially
      ...masjid, // Spread original masjid data
    }));

    await masjidModel.insertMany(bulkMasjids);
    res.status(200).json({ msg: "Bulk masjids created", masjids: bulkMasjids });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
