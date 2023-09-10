import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import DogOfTheDay from '../../Components/DogOfTheDay/DogOfTheDay';
import './Feed.css';

const Feed = () => {
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);

    const getToken = () => {
        const name = 'authToken=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }

    const token = getToken();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:5000/api/posts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await response.json();
        };

        const fetchUsers = async () => {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await response.json();
        };

        Promise.all([fetchPosts(), fetchUsers()])
            .then(([postsData, usersData]) => {
                const postsWithUserNames = postsData.map(post => {
                    const user = usersData.find(u => u.id === post.userId);
                    return {
                        ...post,
                        userName: user ? user.userName : 'Unknown User'
                    };
                });
                setPosts(postsWithUserNames);
            });

    }, [token]);

    const handlePostSubmit = () => {
        fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content: postContent
            })
        })
        .then(response => response.json())
        .then(newPost => {
            setPosts(prevPosts => [newPost, ...prevPosts]);
            setPostContent('');
        });
    };

    const handleLike = (postId) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likesCount: post.likesCount + 1, 
                    isLikedByCurrentUser: true      
                };
            }
            return post;
        }));
    
        fetch(`http://localhost:5000/api/posts/${postId}/like`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to like the post');
            }
            return response.json();
        })
        .then(updatedPost => {
            setPosts(prevPosts => prevPosts.map(post => post.id === postId ? updatedPost : post));
        })
        .catch(error => {
            console.error("There was an error:", error);
    
            setPosts(prevPosts => prevPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likesCount: post.likesCount - 1, 
                        isLikedByCurrentUser: false    
                    };
                }
                return post;
            }));
        });
    };
    

    const handleUnlike = (postId) => {
        fetch(`http://localhost:5000/api/posts/${postId}/unlike`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(updatedPost => {
            setPosts(prevPosts => prevPosts.map(post => post.id === postId ? updatedPost : post));
        });
    };

    return (
        <MainLayout>
        <div className="feed-container">
            <DogOfTheDay />
            <div className="new-post">
                <textarea
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                />
                <button onClick={handlePostSubmit}>Post</button>
            </div>
            <div className="posts-list">
                {Array.isArray(posts) && posts.sort((a, b) => new Date(b.time) - new Date(a.time)).map(post => (
                    <div key={post.id} className="post">
                        <p><strong>{post.userName}</strong>: {post.content}</p>
                        <div className="post-actions">
                            <button onClick={() => handleLike(post.id)}>Like</button>
                            <button 
                                onClick={() => handleUnlike(post.id)} 
                                disabled={!post.isLikedByCurrentUser}
                            >
                                Unlike
                            </button>
                            <span>{post.likesCount} likes</span>
                        </div>
                    </div>
                ))}
            </div>     
        </div>
        </MainLayout>
    );
}

export default Feed;

