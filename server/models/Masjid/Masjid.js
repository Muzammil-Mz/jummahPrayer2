import mongoose from "mongoose";

const masjidSchema = new mongoose.Schema({
  masjidId: {
    type: Number,
    unique: true, // Ensure it's unique
  },
  masjidName: {
    type: String,
    required: true,
  },
  masjidArea: {
    type: String,
    required: true,
  },
  masjidTime: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photos: {
    type: String,
  },
});

// 🔹 Pre-save middleware to assign sequential masjidId
masjidSchema.pre("save", async function (next) {
  if (!this.masjidId) {
    const count = await mongoose.model("masjid").countDocuments();
    this.masjidId = count + 1;
  }
  next();
});

const masjidModel = mongoose.model("masjid", masjidSchema, "masjid");

export default masjidModel;
