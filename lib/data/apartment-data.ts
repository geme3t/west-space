export type ApartmentStatus = "available" | "booked" | "draft" | "maintenance";

export type Apartment = {
  id: string;
  title: string;
  location: string;
  city: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  status: ApartmentStatus;
  image: string;
  features: string[];
};

export const apartments: Apartment[] = [
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
