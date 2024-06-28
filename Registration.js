document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('signup');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(event) {
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
                    showSuccessNotification();
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
    } else {
        console.error('The registration form was not found.');
    }
});

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>Congratulations, you have successfully signed up!</h3>
            <button id="loginButton" class="btn btn-dark">Login</button>
        </div>
    `;
    document.body.appendChild(notification);

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// CSS for the notification
const style = document.createElement('style');
style.innerHTML = `
    .notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center;
        z-index: 1000;
    }
    .notification-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .notification-content h3 {
        margin-bottom: 20px;
    }
`;
document.head.appendChild(style);
