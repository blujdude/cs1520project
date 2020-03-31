function signOut() {
    gapi.load('auth2', function(){
        gapi.auth2.init().then(function (){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                document.location = '/dologout';
                console.log('User signed out.');
            });
        });
    });
    
}