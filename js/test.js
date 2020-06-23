/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};

(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/login.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/login.html';
    });
    function requestPost(file) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                File: {
                    name: file.name,
                    Body: file.body
                }
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }
	function requestList() {
		$.ajax({
			method: 'GET',
			url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
			contentType: 'application/json',
			success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
	}
    function completeRequest(result) {
        var pronoun;
        console.log('Response received from API: ', result);
		if( Object.keys(result).length > 1) {
			$('#listF').empty()
			result.forEach(displayListF)
		}
		else{
			displayUpdate(JSON.stringify(result, null, ' '));
			$('#request').prop('disabled', 'disabled');
			$('#request').text('Set Pickup');
		}
        
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "login.html";
        });
		$('#name').change(handlePickupChanged);

        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
		$('#GETT').click(handleGetClick);
		
		/*document.getElementById("listF").addEventListener("click", function(e) {
			if(e.target && e.target.nodeName == "LI") {
				console.log("List item ", e.target.id, " was clicked!");
			}
		});*/
		$('#listF').on( "click", "li", function( event ) {
			console.log("List item ", this.id, "clicked");
		});
    });

    function handlePickupChanged() {
        var requestButton = $('#request');
        requestButton.text('Request Unicorn');
        requestButton.prop('disabled', false);
    }
	//odpalana requestem
    function handleRequestClick(event) {
        var file = {name:document.getElementById("name").value, body:document.getElementById("testerinho").value};
        event.preventDefault();
		requestPost(file);
        console.log(file);
    }


    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
    function displayListF(text) {
        $('#listF').append($("<li id='" + text + "'>" + text + "&#9747; </li>"));
    }
	function handleGetClick(event) {
		requestList();
	}
	function testalert() {
		console.log("test");
	}
}(jQuery));
