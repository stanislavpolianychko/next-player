import React from "react";
import Header from "@/components/Header";
import Recorder from "@/components/Recorder";
import EpisodesList from "@/components/EpisodesList";
import config from "../../config";


const Home = () => {
    return (
        <>
            {/* Header component displaying the title */}
            <Header headerText={"All episodes"}/>

            {/* EpisodesList component displaying a list of episodes from the provided URL */}
            <EpisodesList url={config.podcastsUrl}></EpisodesList>

            {/* Recorder component for recording audio */}
            <Recorder/>
        </>
    );
};

export default Home;
