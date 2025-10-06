from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_session import Session
from .models import db
import os
from .routes.main import main
from .routes.auth import auth
from .routes.dashboard import dashboard_bp

# Extensions
bcrypt = Bcrypt()
migrate = Migrate()
session = Session()

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", "devkey"),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///solarcalc.sqlite"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_TYPE="filesystem"
    )

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    session.init_app(app)

    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(dashboard_bp)

    return app
