$(function(){

	const $urlForm = $('#url-form');
	const $convertedUrl = $("#converted-url-container");

	$urlForm.on('submit', submitHandler)

	function submitHandler (e) {
	  e.preventDefault();

	  // disable button while processing
	  $urlForm.find("#submit-btn").prop('disabled', true);
	  
	  // send ajax request
	  $.ajax({
	    url: '/shortenUrl',
	    type:'POST',
	    data: $urlForm.serialize()
	  }).done(response => {
	  	if (response) {
	  		if (response.success && response.url) {
	  			
	  			let newUrl = response.url;

	  			$convertedUrl.html("<a href='"+newUrl+"' target='_blank'>"+newUrl+"</a>")
	  				.attr("class", "alert alert-success");
	  		} else {
	  			$convertedUrl.text(response.msg)
	  				.attr("class", "alert alert-danger");
	  		}
	  	}
	  	// enable the button back
	  	$urlForm.find("#submit-btn").prop('disabled', false);
	    console.log(response);
	  })
	}
})
