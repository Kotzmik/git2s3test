/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};

(function rideScopeWrapper($) {
    var authToken;
	const FileTemp = '---\ntitle: name\nlayout: default\n---';
	var textMem;
	const prefix='';
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
		$("#buffer").show();
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
	function requestList(name) {
		$("#buffer").show();
		$.ajax({
			method: 'GET',
			url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
			},
			data: JSON.stringify({
                Dir: 'test',
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
	function requestDelete(name) {
		$("#buffer").show();
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
		$("#buffer").show();
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
            },
		});
	}
	
	function completePut(result) {
        console.log('Response received from API: ', result);
		var txt = $('#POSTtext');
		textMem = [result.File, result.Body];
		$('#name').val(result.File);
		$('#POSTtext').val(result.Body);
		$("#buffer").hide();
	}
	
    function completeRequest(result) {
        console.log('Response received from API: ', result);
		if( Object.keys(result).length > 1) {
			$('#listF').empty()
			result.Prefixes.forEach(displayListP)
			result.Files.forEach(displayListF)
		}
		else{
			displayUpdate(JSON.stringify(result, null, ' '));
			handleHidePost();
			requestList();
		}
        $("#buffer").hide();
    }

    // Register click handler for #request button
    $(function onDocReady() {
		
		$('#POSTx').click(handleHidePost);
        $('#request').click(handleRequestClick);
		$('#NewFile').click(handleNewFile);
		$('#Refresh').click(handleGetClick);
		$('#testtxt').click(function() {
			console.log( textMem )
		});
		$('#x').click(function() {
			$('#authTokenModal').toggle();
		});
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "login.html";
        });
		$('#home').click(handleHome);
        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
				$('#modal').removeClass('w3-disabled');
                displayUpdate('You are authenticated.');
                $('.authToken').text(token);
				requestList();
            }
        });
		
		
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
		//zmienić funkcje żeby odpalały się gdy text różni się od textMem
		$('#name').on("input", handlePostChanged);
		$('#POSTtext').on("input", handlePostChanged);
		
		//event listener for file list
		$('#listF').on( "click", "li span", function( event ) {
			var elem = $( this );
			if ( elem.is( "[class^='prefix']" ) ) {
				console.log("handleDirChange")
				handleDirChange(this.id);
			} else if ( elem.is( "[class^='w3-display-right']" ) ) {
				handleDelete(this.id)
			} else {
				handlePut(this.id)
			}
			console.log(elem)
		});
		
		$('#modal').click(function() {
			$('#authTokenModal').toggle();
		});
		
    });
	
	function handleNewFile() {
		textMem=FileTemp;
		$('#POST').show();
		$('#name').val('name.md');
		$('#POSTtext').val(FileTemp);
		$("div").scrollTop(0);
	}
	function handleDirChange(name) {
		console.log(name)
	}

	function handlePut(name) {
		$('#POST').show();
		$('#request').removeClass("w3-green").prop('disabled', true);
		requestPut(name);
		$("div").scrollTop(0);
	}
	
	function handleHidePost() {
		$('#request').removeClass("w3-green").prop('disabled', true);
		$('#POST').hide();
	}
	function handleDelete(name) {
		requestDelete(name.substr(1))
	}
	
    function handlePostChanged() {
		let file=[$('#name').val(), $('#POSTtext').val()];
		//console.log(file)
		if(JSON.stringify(file)!=JSON.stringify(textMem)){
			$('#request').addClass("w3-green").prop('disabled', false);
		}
		else {
			$('#request').removeClass("w3-green").prop('disabled', true);
		}
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
	function displayListP(text) {
		$('#listF').append($("<li class='w3-display-container' ><span id='" + text + "'class='prefix'>" + text + "</span></li>"));
	}
	function handleGetClick(event) {
		requestList();
	}
	function handleHome() {
		document.location.href="/";
	}

	function testalert() {
		console.log("test");
	}
}(jQuery));
