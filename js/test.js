/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};

(function rideScopeWrapper($) {
    var authToken;
	const FileTemp = '--- \n title: name \n layout: default \n ---';
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
	function requestDelete(name) {
		$.ajax({
			method: 'DELETE',
			url: _config.api.invokeUrl + '/ride',
			headers: {
                Authorization: authToken
            },
			data: JSON.stringify({
                File: name,
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
	function requestPut(name) {
		$.ajax({
			method: 'PUT',
			url: _config.api.invokeUrl + '/ride',
			headers: {
                Authorization: authToken
            },
			data: JSON.stringify({
                File: name,
			}),
			contentType: 'application/json',
			success: completePut,
			error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
		});
	}
	
	function completePut(result) {
        console.log('Response received from API: ', result);
		var txt = $('#POSTtext');
		$('#name').val(result.File);
		txt.val(result.Body);
		textMem=txt;
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
			handleHidePost();
			requestList();
		}
        
    }

    // Register click handler for #request button
    $(function onDocReady() {
		var textMem;
		$('#POSTx').click(handleHidePost);
        $('#request').click(handleRequestClick);
		$('#NewFile').click(handleNewFile);
		$('#Refresh').click(handleGetClick);
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "login.html";
        });

        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
				requestList();
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
		
		$('#name').on("input", handlePostChanged);
		$('#POSTtext').on("input", handlePostChanged);
		
		//event listener for file list
		$('#listF').on( "click", "li span", function( event ) {
			var elem = $( this );
			if ( elem.is( "[class^='w3-display-right']" ) ) {
				handleDelete(this.id)
			} else {
				handlePut(this.id)
			}
		});
    });
	
	function handleNewFile() {
		textMem=FileTemp;
		$('#POST').show();
		$('#name').val('name.md');
		$('#POSTtext').val(FileTemp);
		console.log(textMem);
	}
	
	function handlePut(name) {
		$('#POST').show();
		$('#request').removeClass("w3-green")
		requestPut(name)
		console.log(textTemp);
	}
	
	function handleHidePost() {
		$('#request').removeClass("w3-green")
		$('#POST').hide();
	}
	function handleDelete(name) {
		requestDelete(name.substr(1))
	}
	
    function handlePostChanged() {
		$('#request').addClass("w3-green")
        var requestButton = $('#request');
        requestButton.prop('disabled', false);
    }
	
    function handleRequestClick(event) {
        var file = {name:document.getElementById("name").value, body:document.getElementById("POSTtext").value};
        event.preventDefault();
		requestPost(file);
        console.log(file);
		
    }


    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
    function displayListF(text) {
        $('#listF').append($("<li class='w3-display-container' ><span id='" + text + "'>" + text + "</span><span class='w3-display-right w3-button' id='&times;" + text + "'>&times;</span></li>"));
    }
	function handleGetClick(event) {
		requestList();
	}
	function testalert() {
		console.log("test");
	}
}(jQuery));
