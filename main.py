import flask

app = flask.Flask(__name__)


@app.route('/')
@app.route('/home.html')
def root():
    return flask.render_template("home.html", pagetitle = "Home")

@app.route('/login.html')
def login_page():
    return flask.render_template("login.html", pagetitle = "Login")

@app.route('/signup.html')
def signup_page():
    return flask.render_template("signup.html", pagetitle = "Sign Up")

@app.route('/build.html')
def build_page():
    return flask.render_template("build.html", pagetitle = "Build")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
