// reset.js

// init
$(document).ready(function() {
	init();
	$("#reset").click(function() {
		$("#reset").prop('disabled', true);
		// ToS dialog
		$.ajax({
			type: 'GET',
			url: '/files/RESET_WARNING.txt',
			success: function(result) {
				$('#dialog').html('<pre>' + result + '</pre>');
				$('#dialog').dialog({
					close: function(event,ui) {
		                init();
					},
					resizable: false,
					height:$(window).height() * 0.3,
					width:$(window).width() * 0.5,
					modal: true,
					buttons: {
						Yes : function() {
							$(this).dialog( "close" );
							var url = getUrl('/sys/oauth2auth?p='
								+ getProvider() + "&t=authorization&g=resetApiCredentials", true);
							$("#reset").prop('disabled', false);
							$.ajax({
								dataType: "json",
								type: 'GET',
								url: url,
								success: function(result) {
									window.location.replace(result.authorizationUri);
					                init();
								},
								error: function(resp) {
					                init();
									if (!resp.responseText) {
										alert("Service Not Available for now. Please retry later.");
									} else {
										var result = $.parseJSON(resp.responseText);
										alert("status:" + result.status + ", message:" + result.message, "WARNING");
									}
								}
							});
			                init();
						},
						Cancel: function() {
							$(this).dialog( "close" );
			                init();
						}
					}
				});
			},
			error: function(resp) {
                init();
				if (!resp.responseText) {
					authMessage("Login Failed.", "WARNING");
				} else {
					var result = $.parseJSON(resp.responseText);
					authMessage("status:" + result.status + ", message:" + result.message, "WARNING");
				}
			}
		});
	});
	$('input').bind('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) {
			if (!$("#reset").prop('disabled')) {
				$("#reset").trigger("click");
			}
		}
	});
});

function getProvider() {
	return $('input[name=provider]:checked').val();
}

function init() {
    $("#reset").prop('disabled', false);
	$("#reset").focus();
}

// returns the REST URL
function getUrl(path, unauthorized) {
	var url = "";
	if (debug) {
		url = debug + MOAT_PREFIX + path;
	} else {
		url = SIGNUP_DEST + MOAT_PREFIX + path;
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
