
import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturedCategories } from '@/components/layout/FeaturedCategories';
import { PersonalizedRecommendations } from '@/components/layout/PersonalizedRecommendations';
import { NewArrivals } from '@/components/layout/NewArrivals';
import { SaleBanner } from '@/components/layout/SaleBanner';
import { CustomerReviewGallery } from '@/components/layout/CustomerReviewGallery';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <SaleBanner />
      <CustomerReviewGallery />
      <PersonalizedRecommendations />
    </>
  );
}
