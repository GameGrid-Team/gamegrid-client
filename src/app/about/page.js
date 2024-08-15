'use client'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import LoadingOverlay from '../components/loading'
import SectionWrapper from '../components/textBackground'
import HomeNav from '../components/HomeNav'
export default function About() {
  return (
    <><HomeNav /><div className="p-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-white-800">About Us</h1>
      </header>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">About GameGrid</h2>
        <p className="text-white-600 mb-4">
          Welcome to GameGrid (GG), the ultimate social media platform designed specifically for gamers! Our
          mission is to create a vibrant and engaging community where gamers from all around the world can
          connect, share, and compete. With features tailored to enhance the gaming experience, GameGrid is
          more than just a social network; it's a hub for gamers to thrive.
        </p>

        <h3 className="text-xl font-semibold text-white-700 mb-3">Key Features of GameGrid:</h3>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            <strong>Lobby (Home Page):</strong> Stay updated with the latest posts from gamers you follow and
            discover new content from the community.
          </li>
          <li>
            <strong>Player's Hub (Profile Page):</strong> Showcase your gaming achievements, share your gaming
            interests, and connect with like-minded gamers.
          </li>
          <li>
            <strong>Rank System:</strong> Earn points for activities like posting and engaging with content,
            and watch your rank rise through gaming-themed levels.
          </li>
          <li>
            <strong>Stats Tab:</strong> Keep track of your gaming stats and see how you compare with others.
          </li>
          <li>
            <strong>Preferences Tab:</strong> Customize your GameGrid experience to suit your preferences.
          </li>
          <li>
            <strong>Personalized Feeds:</strong> Toggle between posts from users you follow and the entire
            community to see the content that matters most to you.
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">Meet the Team</h2>
        <p className="text-white-600 mb-4">
          Our dedicated team of developers and designers are passionate about gaming and committed to
          delivering the best experience for our users. Here's a bit about us:
        </p>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>Kobi</li>
          <li>Matan</li>
          <li>Lior</li>
          <li>Eden</li>
          <li>Ron</li>
          <li>Adi</li>
          <li>Liel</li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">Our Vision</h2>
        <p className="text-white-600 mb-4">
          At GameGrid, we believe that gaming is more than just a hobby; it's a way of life. Our platform is
          built by gamers, for gamers, with the aim of fostering a community where everyone can share their
          love for games. Whether you're a casual player or a hardcore gamer, GameGrid is the place for you to
          connect, compete, and grow. Join us on this exciting journey and be a part of the GameGrid
          community!
        </p>
      </SectionWrapper>
    </div></>
  )
}
