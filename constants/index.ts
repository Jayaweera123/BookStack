import email from "@/assets/icons/email.png";
import google from "@/assets/icons/google.png";
import lock from "@/assets/icons/lock.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import check from "@/assets/images/check.png";
import noResult from "@/assets/images/no-result.png";
import ebooks1 from "@/assets/images/ebooks1.jpg";
import ebooks2 from "@/assets/images/ebooks2.png";
import ebooks3 from "@/assets/images/ebooks3.jpg";
import ebook from "@/assets/images/ebook.jpg";

export const images = {
  check,
  noResult,
  ebooks1,
  ebooks2,
  ebooks3,
  ebook,
};

export const icons = {
  email,
  google,
  lock,
  out,
  person,
};

export const onboarding = [
  {
    id: 1,
    title: "Explore a World of Books!",
    description: "Discover your next favorite read with ease.",
    image: images.ebooks1,
  },
  {
    id: 2,
    title: "Organize Your Reading Journey!",
    description: "Track your progress and build your personalized library.",
    image: images.ebooks2,
  },
  {
    id: 3,
    title: "Your Gateway to Knowledge!",
    description: "Access a wide range of educational and entertaining books.",
    image: images.ebooks3,
  },
];

export const data = {
  onboarding,
};
