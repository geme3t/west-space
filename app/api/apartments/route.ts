const apartments = [
  {
    id: "apt-1001",
    title: "East Riverside Apartment",
    location: "East Ridge",
    city: "Nakuru",
    pricePerNight: 120,
    bedrooms: 2,
    bathrooms: 1,
    status: "available",
    image: "/photos/hero.svg",
    features: ["wifi", "parking", "workspace"]
  },
  {
    id: "apt-1002",
    title: "Garden Loft",
    location: "Green Valley",
    city: "Nakuru",
    pricePerNight: 150,
    bedrooms: 2,
    bathrooms: 2,
    status: "booked",
    image: "/photos/hero.svg",
    features: ["wifi", "garden"]
  }
];

export async function GET() {
  return Response.json({
    total: apartments.length,
    apartments,
    fetchedAt: new Date().toISOString()
  });
}
