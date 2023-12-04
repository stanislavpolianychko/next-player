import React from "react";
import Header from "@/components/Header";
import Recorder from "@/components/Recorder";
import EpisodesList from "@/components/EpisodesList";


const Home = () => {
    return (
        <>
            {/* Header component displaying the title */}
            <Header headerText={"All episodes"}/>

            {/* EpisodesList component displaying a list of episodes from the provided URL */}
            <EpisodesList url={'https://anchor.fm/s/8a651488/podcast/rss'}></EpisodesList>

            {/* Recorder component for recording audio */}
            <Recorder/>
        </>
    );
};

export default Home;
