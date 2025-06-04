class BlogStorage {
    constructor() {
        this.storageKey = 'blogger_posts';
    }

    getAllBlogs() {
        const blogs = localStorage.getItem(this.storageKey);
        return blogs ? JSON.parse(blogs) : [];
    }

    saveBlogs(blogs) {
        localStorage.setItem(this.storageKey, JSON.stringify(blogs));
    }

    getBlogById(id) {
        const blogs = this.getAllBlogs();
        return blogs.find(blog => blog.id === id) || null;
    }

    addBlog(blog) {
        const blogs = this.getAllBlogs();
        
        blog.id = this.generateId();
        
        blog.createdAt = new Date().toISOString();
        
        blogs.unshift(blog);
        
        this.saveBlogs(blogs);
        
        return blog;
    }

    updateBlog(id, updatedBlog) {
        const blogs = this.getAllBlogs();
        const index = blogs.findIndex(blog => blog.id === id);
        
        if (index === -1) return null;
        
        updatedBlog.id = id;
        updatedBlog.createdAt = blogs[index].createdAt;
        updatedBlog.updatedAt = new Date().toISOString();
        
        blogs[index] = updatedBlog;
        
        this.saveBlogs(blogs);
        
        return updatedBlog;
    }

    deleteBlog(id) {
        const blogs = this.getAllBlogs();
        const filteredBlogs = blogs.filter(blog => blog.id !== id);
        
        if (filteredBlogs.length === blogs.length) {
            return false;
        }
        
        this.saveBlogs(filteredBlogs);
        return true;
    }

    deleteAllBlogs() {
        localStorage.removeItem(this.storageKey);
        return true;
    }

    filterBlogs(searchTerm = '', category = '') {
        let blogs = this.getAllBlogs();
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            blogs = blogs.filter(blog => 
                blog.title.toLowerCase().includes(term) || 
                blog.content.toLowerCase().includes(term)
            );
        }
        
        if (category) {
            blogs = blogs.filter(blog => blog.category === category);
        }
        
        return blogs;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    addSampleBlogs() {
        const blogs = this.getAllBlogs();
        
        if (blogs.length === 0) {
            const sampleBlogs = [
                {
                    title: "Getting Started with Web Development",
                    category: "Technology",
                    content: "Web development is the work involved in developing a website for the Internet or an intranet. Web development can range from developing a simple single static page of plain text to complex web applications, electronic businesses, and social network services.\n\nFront-end development involves the interface that users interact with. HTML, CSS, and JavaScript are the core technologies for building web pages. Frameworks like React, Angular, and Vue make front-end development faster and more organized.\n\nBack-end development involves the server side, focusing on databases, server logic, and APIs. Common technologies include Node.js, Python, Ruby, PHP, and databases like MySQL and MongoDB.",
                    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                },
                {
                    title: "The Art of Mindful Living",
                    category: "Lifestyle",
                    content: "Mindfulness is the practice of purposely bringing one's attention to experiences occurring in the present moment without judgment. Mindfulness is a skill that can be developed through practice, often through meditation.\n\nBenefits of mindfulness include reduced stress, improved focus, and better emotional regulation. It can be as simple as taking a few minutes each day to sit quietly and focus on your breath.\n\nMindful living extends beyond formal meditation. It's about bringing awareness to everyday activities like eating, walking, and interacting with others. The goal is to fully engage with the present moment rather than being lost in thoughts about the past or future.",
                    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    title: "Exploring the Hidden Gems of Southeast Asia",
                    category: "Travel",
                    content: "Southeast Asia offers a treasure trove of experiences beyond the typical tourist spots. While places like Bali and Bangkok are popular for good reason, venturing off the beaten path reveals authentic cultural experiences and breathtaking natural beauty.\n\nIn Thailand, skip the crowded beaches of Phuket and head to Koh Lanta or Koh Kood for pristine shores without the crowds. Vietnam's Ha Giang loop offers spectacular mountain scenery and glimpses into the lives of ethnic minority groups.\n\nLaos, often overlooked by travelers rushing between Thailand and Vietnam, has the charming UNESCO town of Luang Prabang and the serene 4000 Islands region in the Mekong River. Cambodia has more to offer than just Angkor Wat, including the untouched beaches of Koh Rong and the elephant sanctuaries in Mondulkiri.",
                    imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    title: "The Future of Artificial Intelligence",
                    category: "Technology",
                    content: "Artificial Intelligence (AI) is rapidly transforming our world, from virtual assistants to self-driving cars. The technology continues to evolve at an unprecedented pace, raising both exciting possibilities and important questions about our future.\n\nMachine learning, a subset of AI, enables computers to learn from data and improve their performance over time. Deep learning, a more advanced form of machine learning, has revolutionized fields like computer vision and natural language processing.\n\nAs AI becomes more sophisticated, it's crucial to consider its ethical implications and ensure that these powerful technologies are developed and used responsibly. The future of AI holds immense potential for solving complex problems and improving human lives.",
                    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    title: "Healthy Eating Habits for Busy Professionals",
                    category: "Health",
                    content: "Maintaining healthy eating habits can be challenging for busy professionals, but it's essential for long-term wellbeing. With proper planning and smart choices, you can maintain a nutritious diet even with a hectic schedule.\n\nMeal prepping is a game-changer for busy professionals. Dedicate a few hours on the weekend to prepare healthy meals for the week. Focus on whole foods, lean proteins, and plenty of vegetables.\n\nSmart snacking is another key to success. Keep healthy snacks like nuts, fruits, and yogurt at your desk. Stay hydrated by keeping a water bottle nearby, and consider meal delivery services that offer healthy options when you're too busy to cook.",
                    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                }
            ];
            
            sampleBlogs.forEach(blog => this.addBlog(blog));
        }
    }
}

const blogStorage = new BlogStorage();
