// /app/projects/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import ListingsFullDetailsPage from "@/components/Directory/Listings/FullDetailsPage";
import { Metadata } from "next";

// Define fixed metadata values
const title = "Explore 1,000+ Web3 Projects Directory - Explore Web3"; // dynamically replace value with actual "title" of specific listing been displayed
const description = "Earn Using and Exploring Web3 Projects"; // dynamically replace value with actual  "short_description" of specific listing been displayed
const ogImage = "https://ExploreWeb3.xyz/images/opengraph-image.png"; // dynamically replace value with actual image_url of specific listing been displayed
const siteUrl = "https://ExploreWeb3.xyz"; 

// Create metadata object
export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    url: siteUrl,
    type: 'website',
    title: title,
    description: description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [ogImage],
  },
};

const ListingDetailPage = async ({ params }) => {
  const supabase = createClient();
  const slug = params.slug;

  // Fetch the listing data
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("moderation_status", "approved")
    .single();

  if (listingError) {
    console.error("Error fetching listing:", listingError);
    return <div>Listing not found</div>;
  }

  const categoryIds = [
    listing.category_1,
    listing.category_2,
    listing.category_3,
    listing.category_4,
    listing.category_5,
  ].filter(Boolean);

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", categoryIds);

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return <div>Listing not found</div>;
  }

  const categoryNamesWithId = categoriesData.reduce(
    (acc, category) => ({ ...acc, [category.id]: category.name }),
    {}
  );

  const updatedListing = {
    ...listing,
    category_1_name: categoryNamesWithId[listing.category_1],
    category_2_name: categoryNamesWithId[listing.category_2],
    category_3_name: categoryNamesWithId[listing.category_3],
    category_4_name: categoryNamesWithId[listing.category_4],
    category_5_name: categoryNamesWithId[listing.category_5],
  };

  // Fetch the user data
  const { data: userData, error: userError } = await supabase.auth.getUser();


  const userId = userData.user ? userData.user.id : null;

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col-reverse gap-7.5 lg:flex-row xl:gap-12.5">
          <ListingsFullDetailsPage listing={updatedListing} userId={userId} />
        </div>
      </div>
    </section>
  );
};

export default ListingDetailPage;


