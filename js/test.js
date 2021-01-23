/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};

(function rideScopeWrapper($) {
    var authToken;
	const FileTemp = '---\ntitle: name\nlayout: default\n---';
	var textMem;
	var dir, file;
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
				Content: 'post',
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
	
	function requestPostTest(file) {
		$("#buffer").show();
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
			data: JSON.stringify(file),
			processData: false,
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

	function requestList(directory) {
		updateDir(directory);
		$("#buffer").show();
		$.ajax({
			method: 'POST',
			url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken,
			},
			data: JSON.stringify({
				Content: 'list',
				directory
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
			handleDirView(result)
			
		}
		else{
			displayUpdate(JSON.stringify(result, null, ' '));
			handleHidePost();
			requestList(dir);
		}
		file=undefined
        $("#buffer").hide();
    }


    $(function onDocReady() {
		
		$('.toggleDDjs').click(function() {
			$('#newFileDrop').toggleClass("w3-show")
		})
		$('#POSTx').click(handleHidePost);
		$('#requestText').click(handleRequestClick);
		$('#requestLocal').click(handleUploadFile)
		$('#NewFile').click(handleNewFile);
		$('#Refresh').click(handleGetClick);
		$('#UploadFile').change(handleUploadChange);

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
		
		$('#name').on("input", handlePostChanged);
		$('#POSTtext').on("input", handlePostChanged);
		
		//event listener for file list
		$('#listF').on( "click", "li span", function() {
			var elem = $( this );
			if ( elem.is( "[class^='prefix']" ) ) {
				//console.log("handleDirChange")
				//console.log(dir)
				handleDirChange(this.id);
			}else if(elem.is("[class^='back']")) {
				//console.log(dir)
				handleDirBack()
			} else if ( elem.is( "[class^='w3-display-right']" ) ) {
				handleDelete(this.id.substr(1))
			} else {
				handlePut(this.id)
			}
			console.log(elem)
		});
		$('#dirHome').click(function() {
			handleDirChange(undefined)
		})

		$('#modal').click(function() {
			$('#authTokenModal').toggle();
		});
		$(document).click(function(e) {
			let $target=$(e.target);
			if(!$target.closest('.toggleDDjs').length && 
  			$('#newFileDrop').hasClass("w3-show")) {
				$('#newFileDrop').toggleClass("w3-show")
			}
		})
    });
	
	function handleNewFile() {
		textMem=FileTemp;
		$('#POST').show();
		$('#POSTtext').show();
		$('#requestText').removeClass("w3-orange").prop('disabled', false);
		if(dir!==undefined) {
			$('#name').val(dir+'name.md');
		}else {$('#name').val('name.md');}
		
		$('#POSTtext').val(FileTemp);
		$("div").scrollTop(0);
	}
	function handleDirChange(name) {
		//dir=name;
		requestList(name);
			dir=name
	}

	function handleDirBack(){
		try{
			dir=dir.slice(0,-1)
			let pos=dir.lastIndexOf('/')
			if (pos!=-1) {
			dir=dir.slice(0,pos)+'/'
			console.log(dir)
			} else dir=undefined; 
		}
		catch(err){
			console.log('name puste')
		}
		requestList(dir)
	}

	function handlePut(name) {
		$('#POST').show();
		$('#POSTtext').show();
		$('#requestText').removeClass("w3-orange").prop('disabled', true);
		requestPut(name);
		$("div").scrollTop(0);
	}
	
	function handleHidePost() {
		$('#requestText').removeClass("w3-orange").prop('disabled', true);
		$('#POST').hide();
		$('#POSTtext').hide();
		$('#requestText').show();
		$('#requestLocal').hide();
	}
	function handleDelete(name) {
		let c=confirm("Are you sure you want to delete "+name+"?");
		if(c==true) {
			requestDelete(name)
		}
	}
	
    function handlePostChanged() {
		let file=[$('#name').val(), $('#POSTtext').val()];
		//console.log(file)
		if(JSON.stringify(file)!=JSON.stringify(textMem)){
			$('#requestText').addClass("w3-orange").prop('disabled', false);
		}
		else {
			$('#requestText').removeClass("w3-orange").prop('disabled', true);
		}
    }
	
    function handleRequestClick(val) {
		if (!val===undefined) console.log(val)
        let file = {name:document.getElementById("name").value, body:document.getElementById("POSTtext").value};
		requestPost(file);
        console.log(file);
    }


    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
    function displayListF(text) {
        $('#listF').append($("<li class='listubc w3-display-container' ><span id='" + text + "'class='dir-text'><img src='assets/file.svg'class='svg'>" + subDirName(text) + "</span><span class='w3-display-right w3-container del' id='&times;" + text + "'>&times;</span></li>"));
	}
	function displayListP(text) {
		$('#listF').append($("<li class='listubc w3-display-container' ><span id='" + text + "'class='prefix dir-text'><img src='/assets/dir.svg'class='svg'>" + subDirName(text).slice(0,-1) + "</span></li>"));
	}
	function displayListB(text) {
		$('#listF').append($("<li class='listubc w3-display-container' ><span id='" + text + "'class='back dir-text'><img src='assets/back.svg'class='svg'>" + text + "</span></li>"));
	}
	function handleGetClick() {
		requestList();
	}
	function handleHome() {
		document.location.href="/";
	}

	function handleDirView(result) {
		$('#listF').empty()
		let check=$('#DIRECTORY').text();
		//console.log(dir)
		if (check!='S3:/') {
			displayListB('[..]')
		}
		result.Prefixes.forEach(displayListP)
		result.Files.forEach(displayListF)
	}
	function updateDir(name){
		if(name==undefined) {
			name=''
		}
		$('#DIRECTORY').text("S3:/"+name)
	}

	function subDirName(name){
		if(dir!==undefined) {
			//console.log(name.replace(dir,""))
			return name.replace(dir,"")
		}else {return name}
	}

	function handleUploadChange(e){
		file=e.target.files[0]
		console.log(dir)
		if(dir!==undefined) {
			$('#name').val(dir+file.name);
		}else {$('#name').val(file.name);}
		$('#requestText').hide();
		$('#requestLocal').show();
		$('#POST').show();
	}
	function handleUploadFile(){
		file.name=$('#name').val();
		console.log(file)
		const reader=new FileReader();
		reader.readAsArrayBuffer(file)
		reader.onload= function() {
			let ui8ta=new Uint8Array(reader.result)
			let ui8a=Array.from(ui8ta)
			console.log(reader.result)
			let data= {Content: 'postF', File:{name: $('#name').val(), Body: ui8a}}
			console.log(JSON.stringify(data))
			requestPostTest(data)
		}
		
		
	}
}(jQuery));
