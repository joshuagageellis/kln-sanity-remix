import {FooterSocialLinksOnly} from '~/components/footers/FooterSocialLinksOnly';
import {PrimaryFooter} from '~/components/footers/PrimaryFooter';
import {CarouselSection} from '~/components/sections/CarouselSection';
import {CollectionBannerSection} from '~/components/sections/CollectionBannerSection';
import {CollectionListSection} from '~/components/sections/CollectionListSection';
import {CollectionProductGridSection} from '~/components/sections/CollectionProductGridSection';
import {FeaturedCollectionSection} from '~/components/sections/FeaturedCollectionSection';
import {FeaturedProductSection} from '~/components/sections/FeaturedProductSection';
import {FeaturedWorkSection} from '~/components/sections/FeaturedWorkSection';
import {HomepageCarouselSection} from '~/components/sections/HomepageCarouselSection';
import {HomepageLargeText} from '~/components/sections/HomepageLargeText';
import {ImageBannerSection} from '~/components/sections/ImageBannerSection';
import { PageTopperSection } from '~/components/sections/PageTopperSection';
import {ProductInformationSection} from '~/components/sections/ProductInformationSection';
import {RelatedProductsSection} from '~/components/sections/RelatedProductsSection';
import {RichtextSection} from '~/components/sections/RichtextSection';
import {TwoColumnAccordionSection} from '~/components/sections/TwoColumnAccordionSection';


export const sections: {
  [key: string]: React.FC<any>;
} = {
  carouselSection: CarouselSection,
  collectionBannerSection: CollectionBannerSection,
  collectionListSection: CollectionListSection,
  collectionProductGridSection: CollectionProductGridSection,
  featuredCollectionSection: FeaturedCollectionSection,
  featuredProductSection: FeaturedProductSection,
  featuredWorkSection: FeaturedWorkSection,
  homepageCarouselSection: HomepageCarouselSection,
  homepageLargeText: HomepageLargeText,
  imageBannerSection: ImageBannerSection,
  pageTopperSection: PageTopperSection,
  primaryFooter: PrimaryFooter,
  productInformationSection: ProductInformationSection,
  relatedProductsSection: RelatedProductsSection,
  richtextSection: RichtextSection,
  socialLinksOnly: FooterSocialLinksOnly,
  twoColumnAccordionSection: TwoColumnAccordionSection,
};
