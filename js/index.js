document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const repoList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchInput = document.getElementById('search').value.trim();
  
      if (searchInput) {
        try {
          // Clear previous results
          userList.innerHTML = '';
          repoList.innerHTML = '';
  
          // Search for users matching the input
          const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchInput}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
  
          if (!usersResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const userData = await usersResponse.json();
  
          // Display users in the UI
          userData.items.forEach(user => {
            const userItem = document.createElement('li');
            userItem.classList.add('user');
            userItem.innerHTML = `
              <img src="${user.avatar_url}" alt="Avatar of ${user.login}">
              <div>
                <h4>${user.login}</h4>
                <a href="${user.html_url}" target="_blank">Profile</a>
              </div>
            `;
            userList.appendChild(userItem);
  
            // Add event listener to show repos on user click
            userItem.addEventListener('click', async () => {
              try {
                // Clear previous repo list
                repoList.innerHTML = '';
  
                // Fetch repositories of the selected user
                const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                  headers: {
                    'Accept': 'application/vnd.github.v3+json'
                  }
                });
  
                if (!reposResponse.ok) {
                  throw new Error('Failed to fetch repository data');
                }
  
                const reposData = await reposResponse.json();
  
                // Display repositories in the UI
                reposData.forEach(repo => {
                  const repoItem = document.createElement('li');
                  repoItem.classList.add('repo');
                  repoItem.innerHTML = `
                    <h4>${repo.name}</h4>
                    <p>${repo.description || 'No description'}</p>
                    <a href="${repo.html_url}" target="_blank">View Repo</a>
                  `;
                  repoList.appendChild(repoItem);
                });
              } catch (error) {
                console.error('Error fetching repository data:', error);
              }
            });
          });
  
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });
  });
  