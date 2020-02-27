import flask
from flask import request
app = flask.Flask(__name__)


@app.route('/')
@app.route('/home.html')
def root():
    return flask.render_template("home.html", pagetitle = "Home")


@app.route('/login.html')
def login_page():
    return flask.render_template("login.html", pagetitle = "Login")

@app.route('/grid.html', methods=['POST'])
def grid_page():
    if(request.method=="POST"):
        length = request.form['length']
        height = request.form['height']
        return flask.render_template("grid.html", height=height, length=length)
    else:
        return "<html>There was an error</html>"

@app.route('/signup.html')
def signup_page():
    return flask.render_template("signup.html", pagetitle = "Sign Up")

@app.route('/register', methods=['POST'])
def register_user():
    username = flask.request.form.get('username')
    password = flask.request.form.get('password')
    email = flask.request.form.get('email')
    #passwordhash = get_password_hash(password1)
    #lmsdatastore.save_user(user, passwordhash)
    #flask.session['user'] = user.username
    return flask.redirect('/build.html')

@app.route('/build.html')
def build_page():
    return flask.render_template("build.html", pagetitle = "Build")

@app.route('/savebuild', methods=['POST'])
def save_build():
	map = flask.request.form.get('map')
	#get username
	#save map and username
	return flask.redirect('/build.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
