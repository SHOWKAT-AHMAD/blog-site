const blogGrid = document.getElementById('blogGrid');
const noBlogs = document.getElementById('noBlogs');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const blogCount = document.getElementById('blogCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const firstBlogBtn = document.getElementById('firstBlogBtn');
const viewBlogModal = document.getElementById('viewBlogModal');
const blogDetails = document.getElementById('blogDetails');
const closeViewModal = document.getElementById('closeViewModal');
const backToBlogs = document.getElementById('backToBlogs');
const deleteModal = document.getElementById('deleteModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

let currentBlogs = [];
let selectedBlogId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    setupEventListeners();
    
    if (blogStorage.getAllBlogs().length === 0) {
        resetAndAddSampleBlogs();
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === viewBlogModal) {
            closeViewBlogModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
});

function setupEventListeners() {
    searchInput.addEventListener('input', debounce(filterBlogs, 300));
    categoryFilter.addEventListener('change', filterBlogs);
    
    clearAllBtn.addEventListener('click', confirmClearAll);
    
    firstBlogBtn.addEventListener('click', () => {
        document.getElementById('addBlogBtn').click();
    });
    
    if (closeViewModal) {
        closeViewModal.addEventListener('click', closeViewBlogModal);
    } else {
        console.error('Close view modal button not found');
    }
    
    if (backToBlogs) {
        backToBlogs.addEventListener('click', closeViewBlogModal);
    } else {
        console.error('Back to blogs button not found');
    }
    
    cancelDelete.addEventListener('click', closeDeleteModal);
    confirmDelete.addEventListener('click', confirmDeleteBlog);
    
    blogGrid.addEventListener('click', handleBlogGridClick);
}

function loadBlogs() {
    currentBlogs = blogStorage.getAllBlogs();
    updateBlogDisplay();
}

function updateBlogDisplay() {
    blogCount.textContent = `(${currentBlogs.length})`;
    
    if (currentBlogs.length === 0) {
        noBlogs.classList.remove('hidden');
        blogGrid.classList.add('hidden');
        clearAllBtn.classList.add('hidden');
    } else {
        noBlogs.classList.add('hidden');
        blogGrid.classList.remove('hidden');
        clearAllBtn.classList.remove('hidden');
    }
    
    renderBlogs();
}

function renderBlogs() {
    blogGrid.innerHTML = '';
    
    currentBlogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        blogGrid.appendChild(blogCard);
    });

    animateCards();
}

function createBlogCard(blog) {
    const card = document.createElement('article');
    card.className = 'blog-card bg-white rounded-lg shadow-md overflow-hidden';
    card.dataset.id = blog.id;
    
    const formattedDate = blogStorage.formatDate(blog.createdAt);
    const updateText = blog.updatedAt ? `<span class="text-indigo-500">(Updated: ${blogStorage.formatDate(blog.updatedAt)})</span>` : '';
    
    const truncatedContent = blog.content.length > 150 
        ? blog.content.substring(0, 150) + '...' 
        : blog.content;
    
    const imageHtml = blog.imageUrl 
        ? `<div class="h-48 overflow-hidden">
             <img src="${blog.imageUrl}" alt="${blog.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'; this.classList.add('opacity-50');">
           </div>`
        : '';

    card.innerHTML = `
        ${imageHtml}
        <div class="p-5">
            <div class="flex justify-between items-start mb-2">
                <span class="category-badge">${blog.category}</span>
                <div class="flex space-x-1">
                    <button class="edit-blog text-gray-500 hover:text-indigo-600 p-1" title="Edit Blog">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-blog text-gray-500 hover:text-red-600 p-1" title="Delete Blog">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <h3 class="text-xl font-semibold mb-2 hover:text-indigo-600 cursor-pointer view-blog">${blog.title}</h3>
            <p class="text-gray-600 mb-4 truncate-3">${truncatedContent}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">${formattedDate} ${updateText}</span>
                <button class="view-blog text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Read More <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function handleBlogGridClick(e) {
    const card = e.target.closest('.blog-card');
    if (!card) return;
    
    const blogId = card.dataset.id;

    if (e.target.closest('.view-blog')) {
        viewBlog(blogId);
        return;
    }
    
    if (e.target.closest('.edit-blog')) {
        editBlog(blogId);
        return;
    }
    
    if (e.target.closest('.delete-blog')) {
        showDeleteModal(blogId);
        return;
    }
}

function filterBlogs() {
    const searchTerm = searchInput.value.trim();
    const category = categoryFilter.value;
    
    currentBlogs = blogStorage.filterBlogs(searchTerm, category);
    updateBlogDisplay();
}

function viewBlog(blogId) {
    const blog = blogStorage.getBlogById(blogId);
    if (!blog) return;
    
    const formattedContent = blog.content
        .split('\n\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
    
    const formattedDate = blogStorage.formatDate(blog.createdAt);
    const updateText = blog.updatedAt ? `<span class="text-indigo-500 ml-2">(Updated: ${blogStorage.formatDate(blog.updatedAt)})</span>` : '';
    
    const imageHtml = blog.imageUrl 
        ? `<div class="mb-6">
             <img src="${blog.imageUrl}" alt="${blog.title}" class="w-full h-auto rounded-lg shadow-md max-h-96 object-contain mx-auto"
                  onerror="this.onerror=null; this.src='https://via.placeholder.com/800x600?text=Image+Not+Found'; this.classList.add('opacity-50');">
           </div>`
        : '';
    
    blogDetails.innerHTML = `
        ${imageHtml}
        <h2 class="text-3xl font-bold mb-2">${blog.title}</h2>
        <div class="flex flex-wrap items-center mb-6">
            <span class="category-badge mr-3">${blog.category}</span>
            <span class="text-gray-500">${formattedDate} ${updateText}</span>
        </div>
        <div class="blog-content text-gray-700 leading-relaxed overflow-auto">
            ${formattedContent}
        </div>
    `;
    
    viewBlogModal.classList.remove('hidden');
    
    setTimeout(() => {
        const modalContent = viewBlogModal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.classList.add('modal-enter');
        }
    }, 10);
}

function closeViewBlogModal() {
    console.log('Closing blog view modal');
    viewBlogModal.classList.add('hidden');
    
    const modalContent = viewBlogModal.querySelector('.bg-white');
    if (modalContent) {
        modalContent.classList.remove('modal-enter');
    }
}

function editBlog(blogId) {
    const event = new CustomEvent('edit-blog', { detail: { blogId } });
    document.dispatchEvent(event);
}

function showDeleteModal(blogId) {
    selectedBlogId = blogId;
    deleteModal.classList.remove('hidden');
    setTimeout(() => {
        deleteModal.querySelector('.bg-white').classList.add('modal-enter');
    }, 10);
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteModal.querySelector('.bg-white').classList.remove('modal-enter');
    selectedBlogId = null;
}

function confirmDeleteBlog() {
    if (!selectedBlogId) return;
    
    const success = blogStorage.deleteBlog(selectedBlogId);
    if (success) {
        showToast('Blog deleted successfully!');
        loadBlogs();
    } else {
        showToast('Failed to delete blog', 'error');
    }
    
    closeDeleteModal();
}

function confirmClearAll() {
    if (confirm('Are you sure you want to delete all blogs? This action cannot be undone.')) {
        blogStorage.deleteAllBlogs();
        blogStorage.addSampleBlogs();
        loadBlogs();
        showToast('All blogs deleted and sample blogs added!');
    }
}

function resetAndAddSampleBlogs() {
    blogStorage.deleteAllBlogs();
    blogStorage.addSampleBlogs();
    loadBlogs();
    showToast('Sample blogs added successfully!');
}

function animateCards() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-fade-in');
        }, index * 100);
    });
}

function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container fixed bottom-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `p-3 rounded-lg shadow-lg mb-3 flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-fade-in');
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            toast.remove();
            
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 500);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
} 