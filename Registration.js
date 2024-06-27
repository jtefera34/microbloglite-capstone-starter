document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const fullName = document.getElementById('fullName').value;
  const password = document.getElementById('password').value;

  const user = {
      username: username,
      fullName: fullName,
      password: password
  };

  try {
      const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      if (response.ok) {
          const result = await response.json();
          alert('User registered successfully!');
          console.log(result);
      } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
          console.log(error);
      }
  } catch (error) {
      alert('An unexpected error occurred');
      console.log(error);
  }
});
