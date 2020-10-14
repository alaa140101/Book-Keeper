const modal = document.getElementById('modal');
const modalShow = document.getElementById('add-bookmark');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
bookmarkForm.addEventListener('submit', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue, urlValue) {
  const expression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid URL');
    return false;
  }
  // Valid
  return true;  
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = '';
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Create Item        
    const item = `
    <div class="item">
      <i class="fas fa-times" id="delete-bookmark" title="Delete Bookmark" onclick="deleteBookmark('${url}')"></i>
      <div class="name">
          <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt="Favicon">
          <a href="${url}" target="_blank">${name}</a>
      </div>
    </div>
    `;
    // Insert to bookmarks container
    bookmarksContainer.insertAdjacentHTML("beforeend",  item);
  });
}

// Fetch Bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage if available
  if(localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  buildBookmarks();
  }
}

// Delete Bookmark
function deleteBookmark(url) {
  console.log('delete');
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in localStroage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value ;
  let urlValue = websiteUrlEl.value ;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }
  if(!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();