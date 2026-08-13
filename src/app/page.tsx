import Categories from "@/components/home/Categories"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import Hero from "@/components/home/Hero"
import Newsletter from "@/components/home/Newsletter"
import WhyChooseShopNest from "@/components/home/WhyChooseShopNest"

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Categories/>
      <FeaturedProducts />
      <WhyChooseShopNest/>
      <Newsletter/>
    </div>
  )
}

export default HomePage