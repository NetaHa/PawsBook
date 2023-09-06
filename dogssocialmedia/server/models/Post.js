    class Post {
        constructor(id, content, userId, userName, likes = [], time = new Date()) {
            this.id = id;
            this.content = content;
            this.userName = userName;
            this.userId = userId;  // User who created the post
            this.likes = likes;    // Array of user IDs who liked the post
            this.time = time;
        }

    }
