// signup.js

// init
$(document).ready(function() {
	init();
	$("#signup").click(function() {
		$("#signup").prop('disabled', true);
		// ToS dialog
		$.ajax({
			type: 'GET',
			url: '/files/TERMS.txt',
			success: function(result) {
				$('#dialog').html('<pre>' + result + '</pre>');
				$('#dialog').dialog({
					close: function(event,ui) {
		                init();
					},
					resizable: false,
					height:$(window).height() * 0.7,
					width:$(window).width() * 0.8,
					modal: true,
					buttons: {
						Accept: function() {
							$(this).dialog( "close" );
							var url = getUrl('/sys/oauth2auth?p='
								+ getProvider() + "&t=authorization", true);
							$("#signup").prop('disabled', false);
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
			if (!$("#signup").prop('disabled')) {
				$("#signup").trigger("click");
			}
		}
	});
});

function getProvider() {
	return $('input[name=provider]:checked').val();
}

function init() {
    $("#signup").prop('disabled', false);
	$("#signup").focus();
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
