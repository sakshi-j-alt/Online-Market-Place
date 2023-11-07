$('#login-form').submit(function(event) {
  event.preventDefault();

  // Retrieve username and password values
  const username = $('#username').val();
  const password = $('#password').val();

  // Send AJAX request to backend
  $.ajax({
    url: '/login',
    method: 'POST',
    data: { username, password },
    // success: function(response) {
    //   // Handle successful login response
    //   // Redirect to vendor info page or perform any other actions
      
    // },
    success: function(response) {
  if (response.success) {
    const vendorId = response.vendorId;
    window.location.href = `/vendor-login.html?id=${vendorId}`;
  } else {
    // Handle unsuccessful login response
    console.error('Login failed');
  }
},

    error: function(xhr) {
      // Handle login error
      // Display error message or perform any other actions
      console.error(xhr.responseText);
    }
  });
});
