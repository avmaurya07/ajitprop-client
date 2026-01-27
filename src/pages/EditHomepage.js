import React, { useState } from "react";
import HomeHeroModal from "../components/HomeHeroModal";
import HouseOffersModal from "../components/HouseOffersModal";
import HomeAboutModal from "../components/HomeAboutModal";
import PropertyFeatureModal from "../components/PropertyFeatureModal";
import HomeCounterModal from "../components/HomeCounterModal";
import HomeTestimonialsModal from "../components/HomeTestimonialsModal";
import HomeContactModal from "../components/HomeContactModal";
import FeaturedPropertiesModal from "../components/FeaturedPropertiesModal";
import HomeVideoModal from "../components/HomeVideoModal";
import FooterModal from "../components/FooterModal";

function EditHomepage() {
  // eslint-disable-next-line no-unused-vars
  const [, setRefreshKey] = useState(0);

  // Modal states
  const [modals, setModals] = useState({
    hero: false,
    offers: false,
    about: false,
    feature: false,
    counter: false,
    testimonials: false,
    contact: false,
    featured: false,
    video: false,
    footer: false,
  });

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleSave = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const homeSections = [
    {
      id: "hero",
      title: "Hero Section",
      description:
        "Manage homepage hero title, subtitle, description, and search options",
      icon: "🎯",
    },
    {
      id: "offers",
      title: "House Offers",
      description: "Configure property type categories and counts",
      icon: "🏠",
    },
    {
      id: "featured",
      title: "Featured Properties",
      description: "Configure featured properties section title and settings",
      icon: "🌟",
    },
    {
      id: "about",
      title: "About Section",
      description: "Edit about section content, features, and images",
      icon: "ℹ️",
    },
    {
      id: "feature",
      title: "Property Feature",
      description: "Manage property feature section content and images",
      icon: "⭐",
    },
    {
      id: "video",
      title: "Video Section",
      description: "Manage homepage video content and settings",
      icon: "🎥",
    },
    {
      id: "counter",
      title: "Counter Section",
      description: "Configure achievement counters and statistics",
      icon: "📊",
    },
    {
      id: "testimonials",
      title: "Testimonials",
      description: "Manage customer testimonials and reviews",
      icon: "💬",
    },
    {
      id: "contact",
      title: "Contact Section",
      description: "Edit contact form settings and map embed",
      icon: "📍",
    },
    {
      id: "footer",
      title: "Footer Section",
      description: "Edit footer content, contact info, newsletter, and links",
      icon: "📄",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Homepage
          </h1>
          <p className="text-gray-600">
            Manage all homepage content and sections from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{section.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {section.description}
              </p>
              <button
                onClick={() => openModal(section.id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Edit {section.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <HomeHeroModal
        isOpen={modals.hero}
        onClose={() => closeModal("hero")}
        onSave={handleSave}
      />
      <HouseOffersModal
        isOpen={modals.offers}
        onClose={() => closeModal("offers")}
        onSave={handleSave}
      />
      <HomeAboutModal
        isOpen={modals.about}
        onClose={() => closeModal("about")}
        onSave={handleSave}
      />
      <PropertyFeatureModal
        isOpen={modals.feature}
        onClose={() => closeModal("feature")}
        onSave={handleSave}
      />
      <HomeCounterModal
        isOpen={modals.counter}
        onClose={() => closeModal("counter")}
        onSave={handleSave}
      />
      <HomeTestimonialsModal
        isOpen={modals.testimonials}
        onClose={() => closeModal("testimonials")}
        onSave={handleSave}
      />
      <HomeContactModal
        isOpen={modals.contact}
        onClose={() => closeModal("contact")}
        onSave={handleSave}
      />
      <FeaturedPropertiesModal
        isOpen={modals.featured}
        onClose={() => closeModal("featured")}
        onSave={handleSave}
      />
      <HomeVideoModal
        isOpen={modals.video}
        onClose={() => closeModal("video")}
        onSave={handleSave}
      />
      <FooterModal
        isOpen={modals.footer}
        onClose={() => closeModal("footer")}
        onSave={handleSave}
      />
    </div>
  );
}

export default EditHomepage;
