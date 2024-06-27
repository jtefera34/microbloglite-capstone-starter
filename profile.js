"use strict";

const loginData = getLoginData();

document.addEventListener('DOMContentLoaded', function() {
  // Fetch user profile info and posts when the page loads
  fetchUserProfile();
  fetchUserPosts();

  // Handle post creation
  document.getElementById('create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    await createPost();
    fetchUserPosts(); // Refresh the posts after creating a new one
  });

  // Handle logout
  document.getElementById('logout').addEventListener('click', function() {
    logout();
  });
});

async function fetchUserProfile() {
  try {
    const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (response.ok) {
      const user = await response.json();
      document.getElementById('profileName').textContent = user.fullName || user.username;
      document.getElementById('profileBio').textContent = user.bio || 'Bio not available';
      document.getElementById('profileLocation').textContent = user.location || 'Location not available';
      document.getElementById('profileJoined').textContent = new Date(user.createdAt).toLocaleDateString();
      document.getElementById('profileWebsite').href = user.website || '#';
      document.getElementById('profileWebsite').textContent = user.website || 'No website';
      if (user.profilePicture) {
        document.getElementById('profilePic').src = user.profilePicture;
      }
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      console.log(error);
    }
  } catch (error) {
    alert('An unexpected error occurred');
    console.log(error);
  }
}

async function fetchUserPosts() {
  try {
    const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?username=${loginData.username}`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (response.ok) {
      const posts = await response.json();
      displayPosts(posts);
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      console.log(error);
    }
  } catch (error) {
    alert('An unexpected error occurred');
    console.log(error);
  }
}

function displayPosts(posts) {
  const recentPostsSection = document.getElementById('recentPosts');
  recentPostsSection.innerHTML = ''; // Clear existing posts

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <p>${post.text}</p>
      <small>Posted on ${new Date(post.createdAt).toLocaleString()}</small>
      <button class="btn btn-danger" onclick="deletePost('${post._id}')">Delete</button>
    `;
    recentPostsSection.appendChild(postElement);
    recentPostsSection.appendChild(document.createElement('hr'));
  });
}

async function createPost() {
  const postContent = document.getElementById('postContent').value;

  const postData = {
    text: postContent
  };

  try {
    const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      alert('Post created successfully!');
      document.getElementById('create-post-form').reset(); // Reset the form
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      console.log(error);
    }
  } catch (error) {
    alert('An unexpected error occurred');
    console.log(error);
  }
}

async function deletePost(postId) {
  try {
    const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (response.ok) {
      alert('Post deleted successfully!');
      fetchUserPosts(); // Refresh the posts after deletion
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      console.log(error);
    }
  } catch (error) {
    alert('An unexpected error occurred');
    console.log(error);
  }
}
