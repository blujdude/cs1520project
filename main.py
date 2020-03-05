import flask
from flask import request

import load_save_data

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

@app.route('/register', methods=['POST'])
def register_user():gcloud projects add-iam-policy-binding coral-box-229919 --member
    username = flask.request.form.get('username')
    password = flask.request.form.get('password')
    email = flask.request.form.get('email')
    return flask.redirect('/build.html')

@app.route('/build.html')
def build_page():
    map_list = load_save_data.load_maps()
    return flask.render_template("build.html", pagetitle = "Build", maps=map_list)


@app.route('/savebuild', methods=['POST'])
def save_build():
	grid = flask.request.form.get('grid')
	map_name = flask.request.form.get('map_name')
	username = "admin"
	load_save_data.save_grid(username, map_name, grid)
	return flask.redirect('/build.html')

@app.route('/grid.html', methods=['POST'])
def grid_page():
    if(request.method=="POST"):
        length = request.form['length']
        height = request.form['height']
        return flask.render_template("grid.html", height=height, length=length)
    else:
        return "<html>There was an error</html>"

@app.route('/grid/<key>')
def load_grid_page(key):
    map = load_save_data(key)
    return flask.render_template("grid.html", map=map, key=key)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
