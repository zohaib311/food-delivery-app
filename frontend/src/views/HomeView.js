import React from 'react'
import Hero from '../components/hero_others/Hero'
import Categories from '../components/hero_others/Categories'
import PopularItems from '../components/hero_others/PopularItems'
import Restaurants from '../components/hero_others/Restaurants'

export default function HomeView() {
    return (
        <>
            <Hero />
            <Categories />
            <PopularItems />
            <Restaurants />
        </>
    )
}

