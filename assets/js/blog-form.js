
const blogFormModal = document.getElementById('blogFormModal');
const blogForm = document.getElementById('blogForm');
const modalTitle = document.getElementById('modalTitle');
const blogIdInput = document.getElementById('blogId');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const contentInput = document.getElementById('content');
const imageUrlInput = document.getElementById('imageUrl');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeModal = document.getElementById('closeModal');
const addBlogBtn = document.getElementById('addBlogBtn');

let isEditMode = false;

document.addEventListener('DOMContentLoaded', () => {
    setupFormEventListeners();
});

function setupFormEventListeners() {
    addBlogBtn.addEventListener('click', showAddBlogForm);
    
    blogForm.addEventListener('submit', handleFormSubmit);
    
    closeModal.addEventListener('click', closeBlogFormModal);
    cancelBtn.addEventListener('click', closeBlogFormModal);
    
    document.addEventListener('edit-blog', (e) => {
        const blogId = e.detail.blogId;
        showEditBlogForm(blogId);
    });
}

function showAddBlogForm() {
    isEditMode = false;
    modalTitle.textContent = 'Add New Blog';
    saveBtn.textContent = 'Save Blog';
    
    blogForm.reset();
    blogIdInput.value = '';
    
    blogFormModal.classList.remove('hidden');
    setTimeout(() => {
        blogFormModal.querySelector('.bg-white').classList.add('modal-enter');
        titleInput.focus();
    }, 10);
}

function showEditBlogForm(blogId) {
    const blog = blogStorage.getBlogById(blogId);
    if (!blog) {
        showToast('Blog not found', 'error');
        return;
    }
    
    isEditMode = true;
    modalTitle.textContent = 'Edit Blog';
    saveBtn.textContent = 'Update Blog';
    
    blogIdInput.value = blog.id;
    titleInput.value = blog.title;
    categoryInput.value = blog.category;
    contentInput.value = blog.content;
    imageUrlInput.value = blog.imageUrl || '';
    
    blogFormModal.classList.remove('hidden');
    setTimeout(() => {
        blogFormModal.querySelector('.bg-white').classList.add('modal-enter');
        titleInput.focus();
    }, 10);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const blogData = {
        title: titleInput.value.trim(),
        category: categoryInput.value,
        content: contentInput.value.trim(),
        imageUrl: imageUrlInput.value.trim() || null
    };
    
    let result;
    
    if (isEditMode) {
        const blogId = blogIdInput.value;
        result = blogStorage.updateBlog(blogId, blogData);
        
        if (result) {
            showToast('Blog updated successfully!');
        } else {
            showToast('Failed to update blog', 'error');
            return;
        }
    } else {
        result = blogStorage.addBlog(blogData);
        showToast('Blog added successfully!');
    }
    
    closeBlogFormModal();
    loadBlogs();
}

function validateForm() {
    if (!titleInput.value.trim()) {
        showFieldError(titleInput, 'Title is required');
        return false;
    }
    
    if (!categoryInput.value) {
        showFieldError(categoryInput, 'Please select a category');
        return false;
    }
    
    if (!contentInput.value.trim()) {
        showFieldError(contentInput, 'Content is required');
        return false;
    }
    
    if (imageUrlInput.value.trim() && !isValidUrl(imageUrlInput.value.trim())) {
        showFieldError(imageUrlInput, 'Please enter a valid URL');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500', 'focus:ring-red-300');
    
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
    errorMessage.textContent = message;
    
    field.parentNode.insertBefore(errorMessage, field.nextSibling);
    
    field.focus();
    
    setTimeout(() => {
        clearFieldError(field);
    }, 3000);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500', 'focus:ring-red-300');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function closeBlogFormModal() {
    blogFormModal.classList.add('hidden');
    blogFormModal.querySelector('.bg-white').classList.remove('modal-enter');
    
    [titleInput, categoryInput, contentInput, imageUrlInput].forEach(clearFieldError);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
} 