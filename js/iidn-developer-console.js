// iidn-developer-console.js
var accessToken = "";
var debug = null;

var MSG_PLEASE_LOGIN = "Please Login."
var MOAT_PREFIX = "/moat/v1";

// init
$(document).ready(function() {
	$("#auth-applicationId").focus();
	$("#commands").hide();
	authMessage(MSG_PLEASE_LOGIN);
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
			+ $("#auth-authUserId").val() + "&c="
			+ $("#auth-authPassword").val(), true);
		authMessage("accessing...");
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: url,
			success: function(result) {
				accessToken = result.accessToken;
				authMessage("Login Successful.");
				$("#commands").fadeIn();
				$("#logout").prop('disabled', false);
				$('#packageId').focus();
				$('html, body').animate({
				    scrollTop: 180
				 }, 800);
			},
			error: function(resp) {
				$("#login").prop('disabled', false);
				if (!resp.responseText) {
					authMessage("Login Failed.", "WARNING");
				} else {
					var result = $.parseJSON(resp.responseText);
					authMessage("status:" + result.status + ", message:" + result.message, "WARNING");
				}
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
	$("#tokengen").click(function() {
		downloadURL(getUrl("/sys/package/" + $("#packageId").val() + "?secureToken=true"))
	});
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

// validation
function validateAuthUserId() {
	var appId = $("#auth-authUserId").val();
	if (appId && appId.indexOf('@') < appId.length - 1) {
		return true;
	}
	authMessage("Invalid User ID.", "WARNING");
	return false;
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
