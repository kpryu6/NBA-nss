import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/News/News.css";
import Pagination from "react-js-pagination";

function News() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [currentNews, setCurrentNews] = useState([]);

  const fetchNews = async (page) => {
    try {
      const options = {
        method: "GET",
        url: "https://nba-latest-news.p.rapidapi.com/articles",
        params: { source: "nba" },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_NBA_API_KEY,
          "X-RapidAPI-Host": "nba-latest-news.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      console.log(response.data);

      const articles = response.data;

      const totalPages = Math.ceil(articles.length / newsPerPage);
      setTotalPages(totalPages);

      const currentNews = articles;
      setNews(currentNews);

      console.log(currentNews);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
    setCurrentNews(currentNews);
  }, [news, currentPage, newsPerPage]);

  return (
    <div>
      <h1>News</h1>
      {currentNews.map((newsItem, index) => (
        <div key={index} className="news-box">
          <a
            href={newsItem.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h2 style={{ textDecoration: "none", color: "inherit" }}>
              {newsItem.title}
            </h2>
          </a>
        </div>
      ))}

      <Pagination
        activePage={currentPage}
        itemsCountPerPage={newsPerPage}
        totalItemsCount={news.length}
        pageRangeDisplayed={5}
        onChange={paginate}
      />
    </div>
  );
}

export default News;
