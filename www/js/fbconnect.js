(function(FBConnect){
    // var BKGM = BKGM||{}; 
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/png'
        });
    };
    BKGM.FBConnect = function(){        
        // return this;
    }
    BKGM.FBConnect.prototype= {
        init:function(obj,callback){
            var self=this;
            ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) ? this.cordova=null : this.cordova=cordova;
            alert("goi FBConnect");
            var app_id="296632137153437";
            if (obj){
                app_id=obj.appId;
            }
            var loaded=0;
            
        },
        logout:function(callback) {
            var self=this;
            FB.logout(function(response) {
                if(callback) callback(response);
            });
        },            
        login:function(callback) {
            var self=this;
            FB.login(
                function(response) {
                    if (response.session) {
                        if(callback) callback(response);
                    } else {
                        if(callback) callback(response);
                    }
                },
                { scope: "publish_actions" }
            );
        },
        getLoginStatus: function(callback) {
            var self=this;
            FB.getLoginStatus(function(response) {
                              if (response.status == 'connected') {
                                self.isLogin=true;
                                if (callback) callback(response);
                              } else {
                                self.isLogin=false;
                                if (callback) callback(false);
                              }
                              });
            return this;
        },
        getAuthResponse: function(callback){
            var self=this;
            var authResponse = {};
            this.getLoginStatus(function(response){
                if(response && response.authResponse) {authResponse=response.authResponse; if (callback) callback(authResponse);}
                else self.login(function(response){
                    if(response && response.authResponse) {authResponse=response.authResponse; if (callback) callback(authResponse);}
                })
            })
            return authResponse;
        },
        postCanvas:function(message, callback) {
            var authResponse = this.getAuthResponse();
            if (!this.isLogin) {
                alert('Error! Not login FB');
                return;
            }
            var uid = authResponse.userID;
            var access_token = authResponse.accessToken;
            var canvas = document.getElementById("game");
            var imageData = canvas.toDataURL("image/png");
            var mess =message || "http://fb.com/BKGameMaker.com"
            try {
                blob = dataURItoBlob(imageData);
            } catch (e) {
                console.log(e);
            }

            var fd = new FormData();
            fd.append("access_token", access_token);
            fd.append("source", blob);
            fd.append("message", mess);
            try {
                BKGM.ajax({
                    url: "https://graph.facebook.com/me/photos?access_token=" + access_token,
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (data) {
                        console.log("success " + data);
                        $("#poster").html("Posted Canvas Successfully");
                    },
                    error: function (shr, status, data) {
                        console.log("error " + data + " Status " + shr.status);
                    },
                    complete: function () {
                        console.log("Posted to facebook");
                    }
                });

            } catch (e) {
                console.log(e);
            }
        }
    };
   
})();