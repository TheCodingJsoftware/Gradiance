import os
from datetime import datetime, timedelta

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

load_dotenv()

loader = jinja2.FileSystemLoader("dist/html")
env = jinja2.Environment(loader=loader)

VERSION = "0.0.1"


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


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, you need to login via /login")


class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        template = env.get_template("login.html")
        rendered_template = template.render()
        self.write(rendered_template)

    def post(self):
        username = self.get_argument("username")

        print(username)

        self.redirect("/login")


class PrivacyPolicyHandler(tornado.web.RequestHandler):
    def get(self):
        template = env.get_template("privacy_policy.html")
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
            (r"/privacy_policy", PrivacyPolicyHandler),
            (r"/version", VersionHandler),
            (r"/dist/(.*)", tornado.web.StaticFileHandler, {"path": "dist"}),
            (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "app/static"}),
        ]
    )


def check_inactive_sessions():
    now = datetime.now()


if __name__ == "__main__":
    options.parse_command_line()
    app = tornado.httpserver.HTTPServer(make_app())
    app.listen(int(os.getenv("PORT", default=5500)))
    tornado.ioloop.PeriodicCallback(check_inactive_sessions, 60 * 60 * 1000).start()  # Check every hour
    tornado.ioloop.IOLoop.instance().start()