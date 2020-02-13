from flask import Flask, redirect

app = Flask(__name__)


@app.route('/')
@app.route('/home.html')
def root():
    return redirect("/HTML/home.html", code=302)

@app.route('/login.html')
def login_page():
    return redirect('/HTML/login.html', code=302)

@app.route('/build.html')
def build_page():
    return redirect('/HTML/build.html', code=302)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
