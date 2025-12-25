import { Entry } from "../models/userEntry.models.js";
import {sppAngles, solarIrradiance} from "../utils/calculation.js"

const calcEntry = async (req, res) => {
  console.log("Body:", req.body);

  try{
    const {dayNumber, latitude, longitude, hour, minute, localStandardTimeMeridian, tiltAngle, panelAzimuth} = req.body;

    if(
      dayNumber == null ||
      latitude == null ||
      longitude == null ||
      hour == null ||
      minute == null ||
      localStandardTimeMeridian == null ||
      tiltAngle == null ||
      panelAzimuth == null
    ){
      return res.status(400).json({message:"Please fill all input requirements"})
    }

    const sppAngleResults = sppAngles(
      dayNumber,
      latitude,
      longitude,
      localStandardTimeMeridian,
      hour,
      minute,
    ) // returns solarAltitudeAngle, zenithAngle, azimuthAngle, delta, phi, hourAngleRadian, alphaRad }

    console.log("Spp results:", sppAngleResults) 

    const solarIrradianceResults = solarIrradiance(
      dayNumber,
      sppAngleResults.delta,
      sppAngleResults.phi,
      sppAngleResults.hourAngleRadian,
      sppAngleResults.alphaRad,
      tiltAngle,
      panelAzimuth
    ) // returns {beamIrradiance, diffuseTiltedSurface, reflectedIrradiance, totalIrradiance }

    console.log("Solar Irradiance Results:",solarIrradianceResults)
    // if user is logged in lets save these results to mongoDB

    const entryData = {
      userId: req.user?._id || null, // null if user not logged in
      inputs: { dayNumber, latitude, longitude, hour, minute, localStandardTimeMeridian, tiltAngle, panelAzimuth 
      },
      results: {
        ...sppAngleResults,
        ...solarIrradianceResults
      },
    }

    // save entry Data to DB if user logged in
    let savedEntry = null;
    if(req.user){
      savedEntry = await Entry.create(entryData)
    };

    // return payload
    return res.status(200).json({
      message: "Calculation completed",
      results: {...sppAngleResults, ...solarIrradianceResults},
      savedEntry: savedEntry ? savedEntry._id : null,
    });

    // return calculations
  } catch (error) {
      console.error("userEntry Controller Error", error.message)
      return res.status(500).json({
        message:"Server side error", 
        error: error.message});
  }
}

const getUserEntries = async (req, res) => {
  try {
    const userId = req.user?._id;
    // if no user ID
    if(!userId) {
      return res.status(404).json({message:"User Id Not Found"});
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page -1) * limit;

    const entries = await Entry.find({userId}).sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    const totalEntries = await Entry.countDocuments({userId})
    const totalPages = Math.ceil(totalEntries/limit)

    res.status(200).json({entries, page, totalPages, totalEntries})

  } catch (error) {
    console.error("Error With getUserEntries, ", error)
    res.status(500).json({message:"Server Error", error})
  }
}


export{
  calcEntry,
  getUserEntries
}