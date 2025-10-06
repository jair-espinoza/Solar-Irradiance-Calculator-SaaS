from flask import Blueprint, render_template, request, session, flash
from solar_calc import spp_angles, solar_irrdiance
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('Agg') 
import io, base64
import math
from ..models import db, Calculation 

main = Blueprint("main", __name__)

@main.route("/", methods=["GET", "POST"])
def home():
    results = None
    chart_url = None

    if request.method == "POST":
        day_number = int(request.form["day_number"])
        latitude = float(request.form["latitude"])
        longitude = float(request.form["longitude"])
        lstm = float(request.form["lstm"])
        hour = int(request.form["hour"])
        minute = int(request.form["minute"])
        tilt_angle = int(request.form["tilt_angle"])
        panel_azimuth = int(request.form["panel_azimuth"])

        altitude, zenith, azimuth, delta, hra_rad, alpha_rad = spp_angles(day_number, latitude, longitude, lstm, hour, minute )

        I_bn, I_dc, I_rc, I_c, = solar_irrdiance(day_number, math.radians(latitude), delta, hra_rad, alpha_rad, tilt_angle, panel_azimuth)

        results = {
            "inputs": {
            "Day Number": day_number,
            "Latitude": latitude,
            "Longitude": longitude,
            "LSTM": lstm,
            "Hour": hour,
            "Minute": minute,
            "Tilt Angle": tilt_angle,
            "Panel Azimuth": panel_azimuth,
            },

            "outputs": {
            "Solar Altitude": f"{altitude:.2f}°",
            "Zenith Angle": f"{zenith:.2f}°",
            "Azimuth Angle": f"{azimuth:.2f}°",
            "Total Irradiance": f"{I_c:.2f} W/m²"
            }
        }

        if "user_id" in session:
            calc = Calculation(
                user_id=session["user_id"],
                input_data=str(results["inputs"]),
                output_data=str(results["outputs"]),
                latitude = latitude,
                longitude = longitude,
                tilt_angle=tilt_angle,
                panel_azimuth=panel_azimuth,
                total_irradiance = I_c,
            )
            db.session.add(calc)
            db.session.commit()
            flash("Calculation saved to user history", "success")
        else:
            flash("Login to save your calculations.", "info")

        hours = list(range(0,24))
        irradiance_values = []
        for h in hours:
            alt, zen, az, d, hra, alpha = spp_angles(day_number, latitude, longitude, lstm, h, 0)
            I_bn_h, I_dc_h, I_rc_h, I_c_h = solar_irrdiance(
                day_number, math.radians(latitude), d, hra, alpha, tilt_angle, panel_azimuth
            )
            irradiance_values.append(max(I_c_h, 0))
        chart = {"hours": hours, "irradiance": irradiance_values}

        fig, ax = plt.subplots()
        ax.plot(hours, irradiance_values, color="red", linewidth=2)
        ax.fill_between(hours, irradiance_values, color="skyblue", alpha=0.4)
        ax.set_xlabel("Hour of Day")
        ax.set_ylabel("Irradiance (W/m²)")
        ax.set_title("Irradiance through Out the day")

        # Save to BytesIO
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        chart_url = base64.b64encode(buf.getvalue()).decode("utf-8")
        buf.close()
        plt.close(fig)

    return render_template("index.html", results = results, chart_url = chart_url)