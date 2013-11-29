// iidn-developer-console.js
var MSG_PLEASE_LOGIN = "Please Login. You can copy and paste the credenials JSON string to populate the above credentials text boxes (IE won't work, though)."

// init
$(document).ready(function() {
	$("#auth-applicationId").focus();
	$("#commands").hide();
	// instruction
	var message = MSG_PLEASE_LOGIN;
	var show = getURLParameter('show');
	if (show != "") {
		message = "Please refer to the downloaded JSON file and populate the credentials above! " +
		  "See `appId` for Application ID, `clientId` for Client ID and `clientSecret` for Client Secret.";
	}
	// buttons
	authMessage(message);
	$("#login").click(function() {
		if (!authMandatoryValid($("#auth-applicationId"))
				|| !authMandatoryValid($("#auth-authUserId"))
				|| !authMandatoryValid($("#auth-authPassword"))) {
			return;
		}
		if (!validateApplicationId($("#auth-applicationId"))) {
			return;
		}
		if (!validateAuthUserId($("#auth-authUserId"))) {
			return;
		}
		$("#login").prop('disabled', true);
		var url = getUrl('/sys/auth?a='
			+ $("#auth-applicationId").val() + "&u="
			+ $("#auth-authUserId").val(), true);
		authMessage("accessing...");
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			success: function(result) {
				if (result.status == 401) {
					// Challenge
					authMessage("Authentication in progress...");
					var clientNonce = generateClientNonce();
					url += "&c=" + encodeURIComponent(digest($("#auth-authPassword").val(), result.serverNonce, clientNonce))
						+ "&n=" + encodeURIComponent(clientNonce)
						+ "&e=" + result.expireAt
					$.ajax({
						dataType: "json",
						type: 'GET',
						url: url,
						success: function(result) {
							if (result.status) {
								$("#login").prop('disabled', false);
								authMessage("Login Failed. " + result.message, "WARNING");
							} else {
								accessToken = result.accessToken;
								authMessage("Login Successful.");
								$("#commands").fadeIn();
								$("#logout").prop('disabled', false);
								$('#packageId').focus();
								$('html, body').animate({
								    scrollTop: 180
								 }, 800);
							}
						},
						error: function(result) {
							$("#login").prop('disabled', false);
							authMessage("Login Failed.", "WARNING");
						}
					});
				} else {
					$("#login").prop('disabled', false);
					authMessage("Login Failed.", "WARNING");
				}
			},
			error: function(result) {
				$("#login").prop('disabled', false);
				authMessage("Login Failed.", "WARNING");
			}
		});
	});
	$("#logout").click(function() {
		$("#logout").prop('disabled', true);
		var url = getUrl('/sys/auth')
		$("#commands").fadeOut();
		$("#login").prop('disabled', false);
		$.ajax({
			dataType: "json",
			type: 'DELETE',
			url: url,
			success: function(result) {
				authMessage(MSG_PLEASE_LOGIN);
			},
			error: function(resp) {
				authMessage(MSG_PLEASE_LOGIN);
			}
		});
		accessToken = "";
	});
	$('input').filter(function(i) {
		var type = $(this).attr('type');
		var id = $(this).attr('id');
		return (type == "text" || type == "password") && (id.indexOf("auth-") == 0);
	}).bind('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) {
			if ($("#login").prop('disabled')) {
				$("#logout").trigger("click");
			} else {
				$("#login").trigger("click");
			}
		}
	});
	// Commands
	// tokengen command
	$("#tokengen").click(function() {
		downloadURL(getUrl("/sys/package/" + $("#packageId").val() + "?secureToken=true"))
	});
	// Clipboard API
	window.addEventListener("paste", pastEventListener);
});

// validation
function authMandatoryValid(ele) {
	if (!ele.val() || ele.val() == "") {
		authMessage("All fields are mandatory.", "WARNING");
		return false;
	}
	return true;
}

// validation
function validateApplicationId() {
	var appId = $("#auth-applicationId").val();
	if (appId && appId.length == 36 && appId.match("[a-zA-Z0-9\-]*")) {
		return true;
	}
	authMessage("Invalid Application ID.", "WARNING");
	return false;
}
function validateAuthUserId() {
	var appId = $("#auth-authUserId").val();
	if (appId && appId.indexOf('@') < appId.length - 1) {
		return true;
	}
	authMessage("Invalid User ID.", "WARNING");
	return false;
}
function validatePackageId(packageId) {
	if (!pacakgeId) {
		return false;
	}
	// must be 4+ characters
	if (packageId.length < 4) {
		return false;
	}
	// must be within 40 characters
	if (packageId.length > 40) {
		return false;
	}
	// /[a-zA-Z][a-zA-Z0-9\\-_]*/
	var regexpMatched = (/[a-zA-Z][a-zA-Z0-9\-_]*$/.test(packageId));
	return regexpMatched;
}

// show the status message
function authMessage(message, level) {
	var c = ""
	if (level == "WARNING") {
		c = "alert alert-warning";
	} else {
		c = "alert alert-info";
	}
	$("#auth-progress").removeClass().addClass(c).text(message);
}

// returns the REST URL
function getUrl(path, unauthorized) {
	var url = "";
	if (debug) {
		url = debug + MOAT_PREFIX + path;
	} else {
		url = $("#dest").val() + MOAT_PREFIX + path;
	}
	if (!unauthorized) {
		if (url.indexOf('?') >= 0) {
			url += "&";
		} else {
			url += "?";
		}
		url += "token=" + accessToken;
	}
	return url;
}

// performs the download
function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
}

// For Authentication Challenge
// http://stackoverflow.com/a/1349426
function generateClientNonce() {
	var text = "";
	var alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i=0; i < 10; i++) {
	    text += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
	}
    return text;
}

// B64(HmacSHA1(B64(SHA1({:password})), {:client_nonce}:B64(SHA1({:password})):{:server_nonce}))
function digest(password, serverNonce, clientNonce) {
	var passwordSha1B64 = CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
	var hash = CryptoJS.HmacSHA1(passwordSha1B64, clientNonce + ":" + passwordSha1B64 + ":" + serverNonce);
	return hash.toString(CryptoJS.enc.Base64);
}

function getURLParameter(name) {
	// http://stackoverflow.com/a/1404100
	var value = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
	if (value != null) {
		return decodeURI(value);
	} else {
		return "";
	}
}

// Clipboard Event Handler
function pastEventListener(e) {
	var clipboardData = e.clipboardData;
	if (clipboardData) {
		var items = clipboardData.items;
		if (items) {
			for (var i = 0 ; i < items.length ; i++) {
				var clipboardItem = e.clipboardData.items[i];
				var type = clipboardItem.type;
				if (type == "text/plain" || type == "application/json") {
					clipboardItem.getAsString(function(text) {
						populateCreds(text);
					});
				}
			}
		}
	} else {
		// IE11 doesn't work properly...
		// var text = window.clipboardData.getData("Text");
		// populateCreds(text);
	}
}
function populateCreds(text) {
	try {
		var creds = JSON.parse(text);
		$("#auth-applicationId").val(creds.appId);
		$("#auth-authUserId").val(creds.clientId);
		$("#auth-authPassword").val(creds.clientSecret);
	} catch (e) {
		// ignore
	}
}
