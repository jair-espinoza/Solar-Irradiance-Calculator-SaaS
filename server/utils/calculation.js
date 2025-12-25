// Equation of Time (EoT) function
export function equationOfTime(dayNumber) {
    const beta = 2 * Math.PI * (dayNumber - 81) / 365;
    return 9.87 * Math.sin(2 * beta) - 7.53 * Math.cos(beta) - 1.5 * Math.sin(beta)
}

// Declination Angle (γ)
export function declinationAngle(dayNumber) {
    return 23.45 * Math.sin((360 / 365) * (dayNumber - 81) * Math.PI / 180)
}

export function sppAngles(dayNumber, latitude, longitude, localStandardTimeMeridian, hour, minute) {
    // Equation of Time (EoT)
    const equationOfTimeValue = equationOfTime(dayNumber)

    // Time Correction (TC)
    const timeCorrection = 4 * (longitude - localStandardTimeMeridian) + equationOfTimeValue

    // Local Time (LT) in hours
    const localTime = hour + (minute / 60)

    // Local Standard Time (LST) corrected for time and longitude
    const localStandardTime = localTime + timeCorrection / 60

    // Hour Angle (HRA) in degrees
    const hourAngle = 15 * (localStandardTime - 12)

    // Declination Angle (δ) in degrees
    const declAngle = declinationAngle(dayNumber)

    // Convert angles to radians for trigonometric calculations
    const phi = latitude * Math.PI / 180           // Latitude φ
    const delta = declAngle * Math.PI / 180      // Declination δ
    const hourAngleRadian = hourAngle * Math.PI / 180 // Hour Angle HRA in radians

    // Altitude Angle (α)
    const sinAltitudeAngle =
        Math.sin(phi) * Math.sin(delta) +
        Math.cos(phi) * Math.cos(delta) * Math.cos(hourAngleRadian)

    // Clamp value between -1 and 1 for safe asin
    const sinAlpha = Math.max(-1, Math.min(1, sinAltitudeAngle))

    // Solar Altitude Angle in degrees
    const solarAltitudeAngle = Math.asin(sinAlpha) * 180 / Math.PI

    // Zenith Angle (θz) in degrees
    const zenithAngle = 90 - solarAltitudeAngle

    // Convert solar altitude to radians for azimuth calculation
    const alphaRad = solarAltitudeAngle * Math.PI / 180;

    // Azimuth Angle calculation
    const sinGamma = (Math.cos(delta) * Math.sin(hourAngleRadian)) / Math.cos(alphaRad);
    const cosGamma = ((Math.sin(alphaRad) * Math.sin(phi) - Math.sin(delta)) /
                     (Math.cos(alphaRad) * Math.cos(phi)))

    // Azimuth Angle in degrees, normalized to 0–360° compass azimuth
    let azimuthAngle = Math.atan2(sinGamma, cosGamma) * 180 / Math.PI
    azimuthAngle = (azimuthAngle + 180) % 360

    // Return all relevant angles and intermediate radian values
    return { solarAltitudeAngle, zenithAngle, azimuthAngle, delta, phi, hourAngleRadian, alphaRad }
}

export function solarIrradiance(dayNumber, delta, phi, hourAngleRadian, alphaRad, tiltAngle, panelAzimuth) {

    // Constants
    const I_0 = 1361.0; // Solar constant
    const k = 0.149;     // Atmospheric optical depth (k)
    const C = 0.06;      // Empirical constant
    const p = 0.2;       // Reflected Irradiance [assume p = 0.2]

    // Sun is below horizon so return 0.0
    if (alphaRad <= 0.0) {
        return { I_bn: 0.0, I_dc: 0.0, I_rc: 0.0, I_c: 0.0 };
    }

    const beta = tiltAngle * Math.PI / 180;
    const gammaP = panelAzimuth * Math.PI / 180;

    // Angle of incidence (i)
    let cos_i =
        Math.sin(delta) * Math.sin(phi) * Math.cos(beta)
        - Math.sin(delta) * Math.cos(phi) * Math.sin(beta) * Math.cos(gammaP)
        + Math.cos(delta) * Math.cos(phi) * Math.cos(beta) * Math.cos(hourAngleRadian)
        + Math.cos(delta) * Math.sin(phi) * Math.sin(beta) * Math.cos(gammaP)
        + Math.cos(delta) * Math.sin(phi) * Math.sin(gammaP) * Math.sin(hourAngleRadian)

    cos_i = Math.max(-1.0, Math.min(1.0, cos_i));
    const angleOfIncidence = Math.acos(cos_i) * 180 / Math.PI; // degree

    // Solar irradiance (I)
    const I = I_0 * (1 + 0.034 * Math.cos((2 * Math.PI * dayNumber) / 365))

    // Beam Irradiance (I_bn)
    const beamIrradiance = I_0 * Math.exp(-k / Math.sin(alphaRad))

    // Diffuse horizontal irradiance
    const horizontalIrradiance = beamIrradiance * cos_i;

    // Diffuse Irradiance on Tilted Surface (I_dh)
    const diffuseIrradiance = C * beamIrradiance * Math.sin(alphaRad)

    // Diffuse on tilted surface
    const diffuseTiltedSurface = diffuseIrradiance * (1 + Math.cos(beta)) / 2

    // Global Horizontal Irradiance (I_gh)
    const globalHorizontalIrradiance = beamIrradiance * Math.sin(alphaRad) + diffuseIrradiance

    // Reflected Irradiance on Tilted Surface (I_rc)
    const reflectedIrradiance = p * globalHorizontalIrradiance * (1.0 - Math.cos(beta)) / 2

    // Total Irradiance on Tilted Surface (I_c)
    const totalIrradiance = horizontalIrradiance + diffuseTiltedSurface + reflectedIrradiance

    return { beamIrradiance, diffuseTiltedSurface, reflectedIrradiance, totalIrradiance }
}


