import mongoose from "mongoose"

const EntrySchema = new mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

  //  inputs
  inputs:{
    dayNumber:{type: Number, required:true},
    latitude: {type:Number, required: true},
    longitude: {type:Number, required: true},
    hour: {type:Number, required: true},
    minute: {type:Number, required: true},
    tiltAngle: {type:Number, required: true},
    panelAzimuth: {type:Number, required: true},
  },

  // results
  results: {
    solarAltitudeAngle: {type: Number, required: true},
    zenithAngle: {type: Number, required: true},
    azimuthAngle: {type: Number, required: true},
    totalIrradiance: {type: Number, required: true},
  },

  createdAt: {type: Date, default: Date.now}
});

export const Entry = mongoose.model("Entry",EntrySchema)