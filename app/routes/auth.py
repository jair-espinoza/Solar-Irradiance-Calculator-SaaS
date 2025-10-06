from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from ..models import db, User
from werkzeug.security import generate_password_hash

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        username = request.form["username"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:
            flash("Passwords do not match", "error")
            return redirect(url_for("auth.register"))

        if User.query.filter_by(email=email).first():
            flash("Email already registered", "error")
            return redirect(url_for("auth.register"))
        
        if User.query.filter_by(user=username).first():
            flash("Username already taken", "error")
            return redirect(url_for("auth.register"))

        user = User(user=username, email=email, password=generate_password_hash(password))
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        flash("Registration complete! Please log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("register.html")

@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            session["user_id"] = user.id
            flash("Login successful!", "success")
            return redirect(url_for("dashboard.dashboard_view"))
        else:
            flash("Invalid email or password", "error")

    return render_template("login.html")

@auth.route("/logout")
def logout():
    session.pop("user_id", None)
    flash("Logged out successfully.", "info")
    return redirect(url_for("auth.login"))
