import flask
from flask import request
import json
import load_save_data as ls
import group
from google.oauth2 import id_token
from google.auth.transport import requests

app = flask.Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.secret_key = b'p7erewBidzuW3aZEP2t0Uw2pVznoFUt'

CLIENT_ID = '674992425830-63ser9jf5ab49jo5m0ts351d7hbnk2qq.apps.googleusercontent.com'

STATIC_URL = '/static/'

@app.route('/')
@app.route('/home.html')
def root():
    return flask.render_template("home.html", pagetitle="Home")


@app.route('/login.html')
def login_page():
    return flask.render_template("login.html", pagetitle="Login")


@app.route('/signup.html')
def signup_page():
    return flask.render_template("signup.html", pagetitle="Sign Up")


@app.route('/register', methods=['POST'])
def register_user():
    # username = flask.request.form.get('username')
    # password = flask.request.form.get('password')
    # email = flask.request.form.get('email')
    return flask.redirect('/build.html')


@app.route('/build.html')
def build_page():
    username = get_user()
    map_list = ls.load_maps(username)
    return flask.render_template("build.html", pagetitle="Build", maps=map_list)


@app.route('/savebuild', methods=['POST'])
def save_build():

    grid = flask.request.form.get('canvas_data')
    map_name = flask.request.form.get('map_name')
    height = flask.request.form.get('height')
    length = flask.request.form.get('length')
    username = get_user()
    campaign = flask.request.form.get('campaign')
    floor = flask.request.form.get('floor')
    ls.save_grid(username, map_name, grid, height, length, campaign, floor)
    return flask.redirect('/build.html')


@app.route('/grid.html', methods=['POST'])
def grid_page():
    if request.method == "POST":
        length = request.form['length']
        height = request.form['height']
        return flask.render_template("grid.html", height=height, length=length, pagetitle="Build your map")
    else:
        return "<html>There was an error</html>"


@app.route('/grid/<key>')
def load_grid_page(key):

    key = get_user() + "_" + key
    (map, height, length, map_name, map_id, campaign) = ls.load_grid(key)
    return flask.render_template("mygrid.html", height=height, length=length, map=map, map_name=map_name, map_id=map_id, campaign=campaign)


@app.route('/updategrid', methods=['POST'])
def update_grid():

    grid = flask.request.form.get('canvas_data')
    #map_name = flask.request.form.get('map_name')
    map_id = flask.request.form.get('map_id')
    #username = get_user()
    ls.update_grid(map_id, grid)
    return flask.redirect('/build.html')


@app.route('/addfloor', methods=['POST'])
def add_floor():
    username = get_user()
    map_name = flask.request.form.get('map_name')
    campaign = flask.request.form.get('campaign')
    floor = flask.request.form.get('floor')
    height = flask.request.form.get('height')
    length = flask.request.form.get('length')
    grid = None
    ls.save_grid(username, map_name, grid, height, length, campaign, floor)

    StringURL = ("/grid/"+campaign+"_"+map_name+"_"+floor).replace(" ", "_")
    return flask.redirect(StringURL)


@app.route("/retrievegrid", methods=["POST"])
def retrieve_grid():
    partial_key = request.form.get("key")
    username = get_user()
    key = (username + "_" + partial_key).replace(" ", "_")
    print (key)
    data = ls.load_grid_obj(key)
    jsonData = json.dumps(data)
    return flask.Response(jsonData)


@app.route('/make_group_post', methods=['POST'])
def make_group():
    # Have the DM be able to make edits to the map stored in the session with AJAX
    # Have the players ask the Session every few seconds if there has been a change.
    # If there has been, they will then pull the new map (or add players to their session, or whatnot)

    # Insert username code here
    username = get_user()

    print(username)

    obj = group.initializeSession(username)  # JSON of the object

    print(obj.id)

    return flask.Response(json.dumps(group.obj_to_dict(obj)), mimetype='application/json')


@app.route("/delete_group_post", methods=["POST"])
def del_group():
    gid = request.form.get("ID")
    group.delSession(gid)
    print(gid)
    return flask.Response(json.dumps(gid))


@app.route("/join_group.html")
def join_group_page():
    return flask.render_template("join_group.html", pagetitle="Join a Group")


@app.route("/join_group_post", methods=["POST"])
def join_group():
    gid = request.form.get("ID")
    player = get_user()
    session = group.getSession(gid)

    if player not in session.players:  # Add our player to the player list
        session.players.append(player)

    group.updateSession(gid, players=session.players)
    return flask.Response(json.dumps(group.obj_to_dict(session)), mimetype='application/json')


@app.route("/leader_poll", methods=["POST"])  # Returns the session given session ID and updates the map
def leader_poll():
    gid = request.form.get("ID")

    group.updateSession(gid, map=request.form.get("map"), fog=request.form.get("fog"), height=request.form.get("height"), width=request.form.get("width"))

    session = group.getSession(gid)

    return flask.Response(json.dumps(group.obj_to_dict(session)), mimetype='application/json')


@app.route("/player_poll", methods=["POST"])
def player_poll():
    gid=request.form.get("ID")
    session=group.getSession(gid)
    if(session==-1):  # Our session is no longer available
        return flask.Response(json.dumps(session))
    return flask.Response(json.dumps(group.obj_to_dict(session)), mimetype='application/json')


@app.route("/leave_group_post", methods=["POST"])
def leave_group():
    gid = request.form.get("ID")
    player = get_user()
    session = group.getSession(gid)
    try:
        if player in session.players:  # Remove our player from the player list
            session.players.remove(player)
    except AttributeError:
        return flask.Response(json.dumps(gid))

    group.updateSession(gid, players=session.players)
    return flask.Response(json.dumps(gid))


@app.route("/make_group.html")
def group_page():
    map_list = ls.load_maps(get_user())
    return flask.render_template("make_group.html", maps=map_list)

@app.route('/dologout')
def dologout():
    flask.session['user'] = None
    return flask.redirect('/')

@app.route('/authcode', methods=['POST', 'GET'])
def authcode():
    token = flask.request.form.get('token')
    email = flask.request.form.get('email')

    jd = JsonData()
    d = {}

    try:
        req = requests.Request()
        idinfo = id_token.verify_oauth2_token(token, req, CLIENT_ID)
        sources = ['accounts.google.com', 'https://accounts.google.com']
        if idinfo['iss'] not in sources:
            msg = 'Login token is from an unknown source. '
            msg += 'Try logging out and logging back in.'
            jd.add_error(msg)

        userid = idinfo['sub']
        d['userid'] = userid
        flask.session['user'] = email
    except ValueError as e:
        print('Login error: ' + str(e))
        msg = 'There was a problem validating login. '
        msg += 'Try logging out and logging back in.'
        jd.add_error(msg)

    jd.set_data(d)
    return show_json(jd)


@app.route('/setcookie', methods=['POST', 'GET'])
def setcookie():
    if request.method == 'POST':
        user = request.form['email']

    resp = flask.make_response()
    resp.set_cookie('email', user)

    return resp


@app.route('/getuser', methods=['POST', 'GET'])
def get_user():
    return request.cookies.get('email')
    # return "admin"


def show_page(filename, pagedata):
    return flask.render_template(filename, pd = pagedata)

def show_json(json_data):
    response_dict = {
        'errors': json_data.errors,
        'status': json_data.status,
        'data': json_data.data,
    }
    responseJson = json.dumps(response_dict)
    return flask.Response(responseJson, mimetype='application/json')

class PageData(object):
    def __init__(self, title, user):
        self.title = title
        self.errors =[]
        self.p = {}

        def add_error(self, error):
            self.errors.append(error)

        def set_param(self, key, value):
            self.p[key] = value

class JsonData(object):
    def __init__(self):
        self.errors = []
        self.status = []

    def add_error(self, error):
        self.errors.append(error)

    def add_status(self, status):
        self.status.append(status)

    def set_data(self, data):
        self.data = data

def log(msg):
    """Log a simple message."""

    print('main: %s' % msg)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
