import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/NewsComponent.css';

interface News {
    title: string;
    source: string;
    time: string;
    details: string;
    link: string;
}

const NewsComponent: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBirdFluNews = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/get_news', 
                    {
                    search_phrase: "bird flu in Switzerland"
                });
                console.log(response.data.articles);

                // Extract the necessary fields: title, source, time, details, and link
                const newsData = response.data.map((item: any) => ({
                    title: item.title,
                    source: item.source,
                    time: item.time,
                    details: item.details,
                    link: item.link,
                }));

                setNews(newsData);
            } catch (err) {
                console.error("Error fetching bird flu news:", err);
                setError('Failed to fetch news - ' + err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch news for "bird flu Switzerland"
        fetchBirdFluNews();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="news-container">
            <h2 className="news-header">Bird Flu News</h2>
            {news.length === 0 ? (
                <div className="no-news">No news available</div>
            ) : (
                <div className="news-grid">
                    {news.map((newsItem, index) => (
                        <div key={index} className="news-card">
                            <h3 className="news-title">{newsItem.title}</h3>
                            <p><strong>Source:</strong> {newsItem.source}</p>
                            <p><strong>Published:</strong> {newsItem.time}</p>
                            <p className="news-details">{newsItem.details}</p>
                            <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="read-more">
                                Read more
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
};

export default NewsComponent;
