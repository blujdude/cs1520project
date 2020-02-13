from flask import Flask, redirect

app = Flask(__name__)


@app.route('/')
@app.route('/home.html')
def root():
    return Flask.render_template("/HTML/home.html", pagetitle = "Home")

@app.route('/login.html')
def login_page():
    return Flask.render_template("/HTML/login.html", pagetitle = "Login")

@app.route('/build.html')
def build_page():
    return Flask.render_template("/HTML/build.html", pagetitle = "Build")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
