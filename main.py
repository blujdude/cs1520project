import flask
from flask import request
import json
import load_save_data as ls
import group

app = flask.Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


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
    map_list = ls.load_maps()
    return flask.render_template("build.html", pagetitle="Build", maps=map_list)


@app.route('/savebuild', methods=['POST'])
def save_build():

    grid = flask.request.form.get('canvas_data')
    map_name = flask.request.form.get('map_name')
    height = flask.request.form.get('height')
    length = flask.request.form.get('length')
    username = "admin"  # use google login
    ls.save_grid(username, map_name, grid, height, length)
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

    (map, height, length, map_name) = ls.load_grid(key)
    return flask.render_template("mygrid.html", height=height, length=length, map=map, map_name=map_name)


@app.route('/updategrid', methods=['POST'])
def update_grid():

    grid = flask.request.form.get('canvas_data')
    map_name = flask.request.form.get('map_name')
    username = "admin"  # use google login
    ls.update_grid(username+map_name, grid)
    return flask.redirect('/build.html')


@app.route('/make_group_post', methods=['POST'])
def make_group():
    # Have the DM be able to make edits to the map stored in the session with AJAX
    # Have the players ask the Session every few seconds if there has been a change.
    # If there has been, they will then pull the new map (or add players to their session, or whatnot)

    # Insert username code here
    print(request.form)
    username = request.form.get("username")

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
    player = request.form.get("player")
    session = group.getSession(gid)

    if player not in session.players:  # Add our player to the player list
        session.players.append(player)

    group.updateSession(gid, players=session.players)
    return flask.Response(json.dumps(group.obj_to_dict(session)), mimetype='application/json')


@app.route("/leader_poll", methods=["POST"])  # Returns the session given session ID and updates the map
def leader_poll():
    gid = request.form.get("ID")

    group.updateSession(gid, map=request.form.get("map"), height=request.form.get("height"), width=request.form.get("width"))

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
    player = request.form.get("player")
    session = group.getSession(gid)
    if player in session.players:  # Remove our player from the player list
        session.players.remove(player)

    group.updateSession(gid, players=session.players)
    return flask.Response(json.dumps(gid))


@app.route("/make_group.html")
def group_page():
    map_list = ls.load_maps()
    return flask.render_template("make_group.html", maps=map_list)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
