from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Calculation(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    input_data = db.Column(db.String(500))
    output_data = db.Column(db.String(500))
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    tilt_angle = db.Column(db.Float)
    panel_azimuth = db.Column(db.Float)
    total_irradiance = db.Column(db.Float)

    user = db.relationship('User', backref=db.backref('calculations', lazy=True))