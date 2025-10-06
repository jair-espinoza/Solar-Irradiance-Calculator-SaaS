from flask import Blueprint, render_template, session, flash, redirect, url_for, send_file, request
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet
from ..models import User, Calculation, db
from ..utils import login_required
import base64
import matplotlib.pyplot as plt
import io
import math

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/")
@login_required
def dashboard_view():
        user = User.query.get(session['user_id'])

        if not user:
            flash("Please log in to access the dashboard.", "error")
            return redirect(url_for("auth.login"))
        
        calculations = Calculation.query.filter_by(user_id=user.id).order_by(Calculation.date_created.desc()).all()

        return render_template("dashboard.html", user=user, calculations= calculations)

@dashboard_bp.route("/download/<int:calc_id>")
@login_required
def download_pdf(calc_id):
    calc = Calculation.query.get_or_404(calc_id)
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    # Header
    elements.append(Paragraph("<b>Solar Calculation Report</b>", styles["Title"]))
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(f"<b>Date:</b> {calc.date_created.strftime('%Y-%m-%d %H:%M')}", styles["Normal"]))
    elements.append(Paragraph(f"<b>User ID:</b> {calc.user_id}", styles["Normal"]))
    elements.append(Spacer(1, 0.2 * inch))

    # Data table
    data = [
        ["Parameter", "Value"],
        ["Latitude", f"{calc.latitude}°"],
        ["Longitude", f"{calc.longitude}°"],
        ["Tilt Angle", f"{calc.tilt_angle}°"],
        ["Panel Azimuth", f"{calc.panel_azimuth}°"],
        ["Total Irradiance", f"{calc.total_irradiance:.2f} W/m²"],
    ]
    table = Table(data, colWidths=[2.5 * inch, 3.5 * inch])
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.red),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ])
    )
    elements.append(table)
    elements.append(Spacer(1, 0.3 * inch))

    # Build and send PDF
    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"calculation_{calc.id}.pdf", mimetype="application/pdf")

@dashboard_bp.route("/download-multiple", methods=["POST"])
@login_required
def download_multiple():
    selected_ids = request.form.getlist("selected_ids")
    if not selected_ids:
        flash("Please select at least one result to download.", "warning")
        return redirect(url_for("dashboard.dashboard_view"))

    calculations = Calculation.query.filter(Calculation.id.in_(selected_ids)).all()

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph("<b>Solar Irradiance Calculator Batch Report</b>", styles["Title"]))
    elements.append(Spacer(1, 0.5 * inch))

    for calc in calculations:
        elements.append(Paragraph(f"<b>Calculation ID:</b> {calc.id}", styles["Heading3"]))
        elements.append(Paragraph(f"<b>Date:</b> {calc.date_created.strftime('%Y-%m-%d %H:%M')}", styles["Normal"]))
        elements.append(Paragraph(f"<b>Latitude:</b> {calc.latitude}°", styles["Normal"]))
        elements.append(Paragraph(f"<b>Longitude:</b> {calc.longitude}°", styles["Normal"]))
        elements.append(Paragraph(f"<b>Tilt Angle:</b> {calc.tilt_angle}°", styles["Normal"]))
        elements.append(Paragraph(f"<b>Panel Azimuth:</b> {calc.panel_azimuth}°", styles["Normal"]))
        elements.append(Paragraph(f"<b>Total Irradiance:</b> {calc.total_irradiance:.2f} W/m²", styles["Normal"]))
        elements.append(Spacer(1, 0.3 * inch))
        elements.append(Table([[" "]]))  # separator
        elements.append(Spacer(1, 0.3 * inch))

    doc.build(elements)
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="solar_irradiance_report.pdf",
        mimetype="application/pdf",
    )