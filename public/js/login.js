var x = document.getElementById("login");
var y = document.getElementById("signup");
var z = document.getElementById("btn");

function signup() {
    x.style.left = "-400px";
    y.style.left = "25px";
    z.style.left = "110px";
}
function login() {
    x.style.left = "25px";
    y.style.left = "450px";
    z.style.left = "0";
}

function submitForm(event) {
  event.preventDefault(); // Prevent the form from submitting and reloading the page

  const form = document.getElementById('signup-form');
  const successMessage = document.getElementById('success-message');
  
  const formData = new FormData(form);

  fetch('/signup', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        form.style.display = 'none'; // Hide the form
        successMessage.style.display = 'block'; // Show the success message
      } else {
        alert('Error submitting the form. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error submitting the form. Please try again.');
    });
}

document.getElementById('login').addEventListener('submit', function(event) {
  if (!validateLoginform()) {
    event.preventDefault();
  }
});

document.getElementById('signup').addEventListener('submit', function(event) {
  if (!validateSignupform()) {
    event.preventDefault();
  }
});

function validateLoginform() {
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');

  let isValid = true;

  if (!validateEmail(email.value)) {
    email.setCustomValidity('Please enter a valid email address.');
    isValid = false;
  } else {
    email.setCustomValidity('');
  }

  if (password.value.trim() === '') {
    password.setCustomValidity('Please enter a password.');
    isValid = false;
  } else {
    password.setCustomValidity('');
  }
  return isValid;
}

function validateSignupform() {
  const name = document.getElementById('signup-name');
  const email = document.getElementById('signup-email');
  const lastname = document.getElementById('signup-lastname');
  const password = document.getElementById('signup-password');

  let isValid = true;

  if (name.value.trim() === '') {
    name.setCustomValidity('Please enter a name.');
    isValid = false;
  } else {
    name.setCustomValidity('');
  }

  if (lastname.value.trim() === '') {
    lastname.setCustomValidity('Please enter a lastname.');
    isValid = false;
  } else {
    lastname.setCustomValidity('');
  }

  if (!validateEmail(email.value)) {
    email.setCustomValidity('Please enter a valid email address.');
    isValid = false;
  } else {
    email.setCustomValidity('');
  }

  if (password.value.trim() === '') {
    password.setCustomValidity('Please enter a password.');
    isValid = false;
  } else {
    password.set;
  }

  return isValid;
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
