import React, { useState, useEffect } from "react";
import PhotoComponent from "./Components/PhotoComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import search from "./vectors/search.svg";
import "./style.css";

const App = () => {
  // State that holds the photo data
  const [photos, setPhotos] = useState([]);
  // State that hold the user's search input
  const [query, setQuery] = useState("");
  // State that holds the selected page number for the API call
  const [page, setPage] = useState(2);


  useEffect(() => {
    const clientId = process.env.REACT_APP_API_KEY;
    const fetchInitialData = async () => {
      try {
        // Get photos from the API on first render
        const baseUrl = "https://api.unsplash.com";
        const api = `/photos/?client_id=${clientId}&count=10`;
        const response = await fetch(baseUrl + api);
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInitialData();
  }, []);

  const getData = async (query) => {
    // Function to get photos based on user's submitted query

    try {
      const clientId = process.env.REACT_APP_API_KEY;
      const baseUrl = "https://api.unsplash.com/";
      const api = `search/photos/?client_id=${clientId}&count=10`;
      const q = `&query=${query}`;
      const response = await fetch(baseUrl + api + q);
      if (response.status === 403) {
        alert("Unsplash API request rate exceeded!");
        return;
      }
      const data = await response.json();
      setPhotos(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const getMoreData = async () => {
    // Function that gets more data as the user is scrolling
    // Used in the InfiniteScroll component
    try {
      const clientId = process.env.REACT_APP_API_KEY;

      // Fetch data if no query was submitted
      if (!query) {
        const baseUrl = "https://api.unsplash.com/photos/";
        const api = `?client_id=${clientId}&count=10&page=${page}`;
        const response = await fetch(baseUrl + api);
        if (response.status === 403) {
          alert("Unsplash API request rate exceeded!");
          return;
        }
        const data = await response.json();
        setPhotos((prev) => prev.concat(data));
        setPage((prev) => prev + 1);
      } else {
        // With query
        const baseUrl = "https://api.unsplash.com/search/photos/";
        const api = `?client_id=${clientId}&count=10&page=${page}`;
        const q = `&query=${query}`;
        const response = await fetch(baseUrl + api + q);
        if (response.status === 403) {
          alert("Unsplash API request rate exceeded!");
        }
        const data = await response.json();
        setPhotos((prev) => prev.concat(data.results));
        // setPhotos(prev => [...prev, data.results]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Create photo component
  let images;
  if (photos) {
    images = photos.map((item, index) => {
        return (
          <PhotoComponent
            image={item.urls.small}
            key={index}
            user={`${item.user.first_name} ${
              item.user.last_name ? item.user.last_name : ""
            }`}
            profilePage={item.user.links.html}
            profileImage={item.user.profile_image.small}
            portfolio={item.user.portfolio_url}
            download={item.links.html}
          />
        );
    });
  }

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Search for image"
          value={query}
          name="query"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              getData(query);
            }
          }}
        />
        <img
          src={search}
          className="search-icon"
          onClick={() => getData(query)}
          alt="search"
        />
      </div>
      {
        // Infinite scrolling component allows the user to get more images
        // when scrolling
      }
      {photos ? (
        <InfiniteScroll
          dataLength={photos.length}
          next={getMoreData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <div className="photos">{images}</div>
        </InfiniteScroll>
      ) : null}
    </div>
  );
};

export default App;
