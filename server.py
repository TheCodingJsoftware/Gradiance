import os
import uuid
import secrets
from datetime import datetime, timedelta

import msgspec
from dotenv import load_dotenv
import jinja2
import psycopg2
from psycopg2 import sql
import tornado.gen
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.options import define, options
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
from supabase import create_client, Client
from supabase.client import ClientOptions

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key,
  options=ClientOptions(
    postgrest_client_timeout=10,
    storage_client_timeout=10,
    schema="public",
  ))

loader = jinja2.FileSystemLoader("dist/html")
env = jinja2.Environment(loader=loader)

VERSION = "0.0.1"


connected_clients = {}
POSTGRES_USER = os.environ.get("POSTGRES_USER")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
POSTGRES_DB = os.environ.get("POSTGRES_DB")
POSTGRES_HOST = os.environ.get("POSTGRES_HOST")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT")


def connect_db():
    return psycopg2.connect(
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
    )


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class MainHandler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.redirect("/login")
        else:
            self.redirect("/home")


class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        template = env.get_template("login.html")
        rendered_template = template.render(username="", show_password=False, show_incorrect_password_or_username=False)
        self.write(rendered_template)

    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password", None)

        if username == "admin" and not password:
            template = env.get_template("login.html")
            rendered_template = template.render(username=username, show_password=True, show_incorrect_password_or_username=False)
            self.write(rendered_template)
        elif username == "admin" and password != "admin":
            template = env.get_template("login.html")
            rendered_template = template.render(username=username, show_password=True, show_incorrect_password_or_username=True)
            self.write(rendered_template)
        else:
            self.redirect("/home")

        if username == "admin" and password == "admin":
            session_id = str(uuid.uuid4())
            connected_clients[session_id] = {"username": username, "admin": True}
            self.set_secure_cookie("user", username)
            self.set_secure_cookie("session_id", session_id)
            self.redirect("/ungradebook")


class LogoutHandler(BaseHandler):
    def get(self):
        session_id = self.get_secure_cookie("session_id")
        if session_id:
            connected_clients.pop(session_id.decode(), None)
        self.clear_cookie("user")
        self.clear_cookie("session_id")
        self.redirect("/login")


class HomeHandler(BaseHandler):
    def get(self):
            template = env.get_template("home.html")
            rendered_template = template.render()
            self.write(rendered_template)


class GamesHandler(BaseHandler):
    def get(self):
        template = env.get_template("games.html")
        rendered_template = template.render()
        self.write(rendered_template)

class UnGradebookHandler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.redirect("/login")
            return

        session_id = self.get_secure_cookie("session_id")
        if session_id and session_id.decode() in connected_clients:
            client = connected_clients[session_id.decode()]
            if client.get("admin", False):
                template = env.get_template("ungradebook.html")
                rendered_template = template.render()
                self.write(rendered_template)
            else:
                self.redirect("/login")
        else:
            self.redirect("/login")


class PrivacyPolicyHandler(tornado.web.RequestHandler):
    def get(self):
        template = env.get_template("privacy_policy.html")
        rendered_template = template.render()
        self.write(rendered_template)


class MathCurriculumHandler(tornado.web.RequestHandler):
    def get(self):
        template = env.get_template("mathCurriculum.html")
        rendered_template = template.render()
        self.write(rendered_template)


class VersionHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({"version": VERSION})


def make_app():
    return tornado.web.Application(
        [
            (r"/", MainHandler),
            (r"/login", LoginHandler),
            (r"/logout", LogoutHandler),
            (r"/home", HomeHandler),
            (r"/games", GamesHandler),
            (r"/ungradebook", UnGradebookHandler),
            (r"/privacy_policy", PrivacyPolicyHandler),
            (r"/math_curriculum", MathCurriculumHandler),
            (r"/version", VersionHandler),
            (r"/dist/(.*)", tornado.web.StaticFileHandler, {"path": "dist"}),
            (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "app/static"}),
        ],
        cookie_secret=os.environ.get('COOKIE_SECRET', secrets.token_hex(32))
    )

def check_inactive_sessions():
    now = datetime.now()


if __name__ == "__main__":
    options.parse_command_line()
    app = tornado.httpserver.HTTPServer(make_app())
    app.listen(int(os.getenv("PORT", default=5500)))
    tornado.ioloop.PeriodicCallback(check_inactive_sessions, 60 * 60 * 1000).start()  # Check every hour
    tornado.ioloop.IOLoop.instance().start()