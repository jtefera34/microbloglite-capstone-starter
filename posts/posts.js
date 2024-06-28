"use strict";

// Call getLoginData() once and store the result
const loginData = getLoginData();

document.addEventListener('DOMContentLoaded', function() {
  // Fetch user profile information
  fetchUserProfile();

  // Fetch posts when the page loads
  fetchPosts();

  // Fetch members list
  fetchMembers();

  // Handle post creation
  document.getElementById('create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    await createPost();
    fetchPosts(); // Refresh the posts after creating a new one
  });

  // Handle logout
  document.getElementById('logout-button').addEventListener('click', function() {
    logout();
  });

  // Handle profile navigation
  document.getElementById('profile-nav-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.replace("/profile.html");
  });

  // Handle username click
  document.getElementById('user-username').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.replace("/profile.html");
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
      displayUserProfile(user);
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

function displayUserProfile(user) {
  const profilePic = document.getElementById('user-profile-pic');
  const fullName = document.getElementById('user-full-name');
  const username = document.getElementById('user-username');
  
  if (profilePic && fullName && username) {
    profilePic.src = `https://picsum.photos/seed/${user.username}/50`;
    fullName.textContent = user.fullName;
    username.textContent = user.username;
  }
}

async function fetchMembers() {
  try {
    const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (response.ok) {
      const members = await response.json();
      displayMembers(members);
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

function displayMembers(members) {
  const membersList = document.querySelector('#members-list .list-group');
  membersList.innerHTML = ''; // Clear existing members

  members.forEach(member => {
    const memberItem = document.createElement('li');
    memberItem.className = 'list-group-item';
    memberItem.innerHTML = `
      <img src="https://picsum.photos/seed/${member.username}/30" alt="Profile Picture" class="rounded-circle me-2" style="width: 30px; height: 30px;">
      <span>${member.fullName}</span>
      <small class="d-block text-muted">@${member.username}</small>
    `;
    membersList.appendChild(memberItem);
  });
}

async function fetchPosts() {
  try {
    const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
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
  const postViewSection = document.getElementById('post-view');
  postViewSection.innerHTML = ''; // Clear existing posts

  posts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'card mb-4';
    postCard.dataset.postId = post._id; // Add postId to the card

    postCard.innerHTML = `
      <div class="card-header d-flex align-items-center">
        <img src="https://picsum.photos/50" alt="User Profile Picture" class="rounded-circle me-3" style="width: 50px; height: 50px;">
        <div>
          <h5 class="mb-0">${post.username}</h5>
          <small>${new Date(post.createdAt).toLocaleString()}</small>
        </div>
      </div>
      <div class="card-body">
        <p>${post.text}</p>
      </div>
      <div class="card-footer post-actions">
        <i class="bi bi-hand-thumbs-up like-icon" data-post-id="${post._id}" data-liked="false"></i>
        <i class="bi bi-trash delete-icon" data-post-id="${post._id}"></i>
      </div>
    `;

    postViewSection.appendChild(postCard);
  });

  // Add event listeners for the like and delete icons
  document.querySelectorAll('.like-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const postId = this.getAttribute('data-post-id');
      const liked = this.getAttribute('data-liked') === 'true';
      if (liked) {
        unlikePost(postId, this);
      } else {
        likePost(postId, this);
      }
    });
  });

  document.querySelectorAll('.delete-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const postId = this.getAttribute('data-post-id');
      deletePost(postId);
    });
  });
}

async function createPost() {
  const postContent = document.getElementById('post-text').value;

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
      fetchPosts(); // Refresh the posts after creating a new one
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
      fetchPosts(); // Refresh the posts after deletion
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

async function likePost(postId, button) {
  try {
    const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/likes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId })
    });

    if (response.ok) {
      const result = await response.json();
      alert('Post liked successfully!');
      button.classList.add('liked');
      button.classList.remove('btn-primary');
      button.classList.add('btn-success');
      button.textContent = 'Unlike';
      button.setAttribute('data-liked', 'true');
      button.setAttribute('data-like-id', result.id);
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

async function unlikePost(likeId, button) {
  try {
    const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/likes/${likeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (response.ok) {
      alert('Post unliked successfully!');
      button.classList.remove('liked');
      button.classList.remove('btn-success');
      button.classList.add('btn-primary');
      button.textContent = 'Like';
      button.setAttribute('data-liked', 'false');
      button.removeAttribute('data-like-id');
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

function logout() {
  // Clear login data
  localStorage.removeItem('loginData');
  // Redirect to login page
  window.location.replace("/index.html");
}
