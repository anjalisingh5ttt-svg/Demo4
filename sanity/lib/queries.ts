import { groq } from "next-sanity";

export const collectionPageQuery = groq`
  *[_type == "category"] | order(order asc){
    _id,
    title,
    description,
    "slug": slug.current,
    featureTitle,
    reverse,
    featureImage{
      asset->{
        url
      }
    },
    featureVideo{
      asset->{
        url
      }
    },
    "products": *[_type == "product" && references(^._id)][0...3]{
      _id,
      name,
      price,
      originalPrice,
      inStock,
      allowNotify,
      "slug": slug.current,
      mainImage{
        asset->{
          url
        }
      }
    }
  }
`;

export const categoryPageQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "slug": slug.current,
    featureTitle,
    reverse,
    featureImage{
      asset->{
        url
      }
    },
    featureVideo{
      asset->{
        url
      }
    },
    "products": *[_type == "product" && references(^._id)] | order(_createdAt desc){
      _id,
      name,
      price,
      originalPrice,
      inStock,
      allowNotify,
      "slug": slug.current,
      mainImage{
        asset->{
          url
        }
      }
    }
  }
`;

export const productPageQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    description,
    price,
    originalPrice,
    stock,
    inStock,
    allowNotify,
    "slug": slug.current,
    caseSize,
    dialColor,
    strapMaterial,
    caseMaterial,
    movement,
    waterResistance,
    glassType,
    "category": category->title,
    mainImage{
      asset->{
        url
      }
    },
    images[]{
      asset->{
        url
      }
    },
    seo {
      metaTitle,
      metaDescription,
      keywords,
      ogImage { asset->{url} },
      canonicalUrl
    },
    productVideo{
      asset->{
        url
      }
    }
  }
`;

export const featuredCollectionQuery = groq`
  *[_type == "product"] | order(_createdAt desc)[0...4]{
    _id,
    name,
    price,
    originalPrice,
    inStock,
    allowNotify,
    "slug": slug.current,
    mainImage{
      asset->{
        url
      }
    }
  }
`;

export const userAddressesQuery = groq`
  *[_type == "address" && clerkUserId == $clerkUserId] | order(isDefault desc, _createdAt desc){
    _id,
    fullName,
    phone,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault
  }
`;

export const userOrdersQuery = groq`
  *[_type == "order" && clerkUserId == $clerkUserId] | order(createdAt desc){
    _id,
    orderNumber,
    razorpayOrderId,
    razorpayPaymentId,
    clerkUserId,
    customerName,
    customerEmail,
    amount,
    currency,
    status,
    cartItems,
    shippingAddress,
    createdAt
  }
`;

export const userOrderByIdQuery = groq`
  *[_type == "order" && _id == $orderId && clerkUserId == $clerkUserId][0]{
    _id,
    orderNumber,
    razorpayOrderId,
    razorpayPaymentId,
    clerkUserId,
    customerName,
    customerEmail,
    amount,
    currency,
    status,
    cartItems,
    shippingAddress,
    createdAt
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    logoText,
    navLinks,
    contactEmail,
    footerText,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero,
    philosophy{
      title,
      subtitle,
      description1,
      description2,
      description3,
      signatureTitle,
      signatureSubtitle,
      image{
        asset->{
          url
        }
      }
    }
  }
`;

export const heroSectionQuery = groq`
  *[_type == "heroSection"][0]{
    title,
    tagline,
    backgroundType,
    backgroundImage{ asset->{url} },
    backgroundVideoFile{ asset->{url} },
    backgroundVideoUrl,
    ctaText,
    ctaLink,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      ogImage { asset->{url} },
      canonicalUrl
    }
  }
`;

export const footerQuery = groq`
  *[_type == "footer"][0]{
    newsletterText,
    newsletterPlaceholder,
    newsletterButtonText,
    companyLinks,
    quickLinks,
    contactEmailPrimary,
    contactEmailSecondary,
    socialLinks,
    copyrightText,
    bottomTagline
  }
`;