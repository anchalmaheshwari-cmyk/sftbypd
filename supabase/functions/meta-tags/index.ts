import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const listingId = url.searchParams.get("listing");

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let metaTags = {
      title: "Sqft by PD | High-End Real Estate Agent in Chennai",
      description: "Plan your next big move with Chennai's luxury property expert — Sqft by PD. Specializing in premium homes and investment properties in Chennai's most sought-after neighborhoods.",
      image: "/WhatsApp Image 2025-09-18 at 17.26.03.jpeg",
      images: []
    };

    // If listing ID is provided, fetch listing data
    if (listingId) {
      const { data: listing, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .maybeSingle();

      if (listing && !error) {
        const listingImages = listing.images && listing.images.length > 0
          ? listing.images.slice(0, 2)
          : [metaTags.image];

        metaTags = {
          title: `${listing.title} | sqft by PD`,
          description: `₹${listing.price} • ${listing.bhk} BHK • ${listing.size} sqft • ${listing.location}`,
          image: listingImages[0],
          images: listingImages
        };
      }
    }

    return new Response(
      JSON.stringify(metaTags),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});