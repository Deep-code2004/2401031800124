const destinations = [
  {
    name: "Paris, France",
    subtitle: "Eiffel Tower & Seine Night Tour",
    tagline: "Stroll under lights with a 360° rooftop view in Paris.",
    image: "https://images.unsplash.com/photo-1549049725-9c8d1c8d0c82?auto=format&fit=crop&w=800&q=80",
    description: "Immerse yourself in a virtual night tour of Paris. Experience the Eiffel Tower, Louvre reflection, and charming riverwalks from 360° vantage points.",
    features: ["Historic landmarks", "Guided audio narrative", "360° panorama navigation", "Cloud-synced VR mode"],
    video: "https://www.youtube.com/embed/2uwUVzzlTYI",
    link: "https://www.google.com/maps/place/Paris/"
  },
  {
    name: "Maldives",
    subtitle: "Underwater & Overwater Retreat",
    tagline: "Float above tranquil lagoons and dive into coral gardens.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Feel the ocean breeze virtually. A luxury stay on overwater villas and underwater marine life glimpses with interactive navigation.",
    features: ["Ocean soundscape", "Marine life spotlights", "Sunset timelapse", "Depth-triggered light show"],
    video: "https://www.youtube.com/embed/Vr-H_subv5c",
    link: "https://www.google.com/maps/place/Maldives/"
  },
  {
    name: "Tokyo, Japan",
    subtitle: "Neon City & Traditions",
    tagline: "Blend futuristic skyscrapers with calm temple gardens in VR.",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
    description: "Experience Shibuya Crossing, Shinjuku neon, and the serene Meiji Shrine in one immersive VR journey.",
    features: ["Dynamic urban scenes", "Traditional rituals", "Street food smells (AR hint)", "Night-to-day transition"],
    video: "https://www.youtube.com/embed/F8Y0U5DDoY8",
    link: "https://www.google.com/maps/place/Tokyo/"
  }
];

function buildCards(destArray) {
  const row = $("#destinationsRow").empty();
  if (!destArray.length) {
    row.append('<div class="col-12"><div class="alert alert-info">No matching destination found. Try another keyword.</div></div>');
    return;
  }

  destArray.forEach(dest => {
    const card = `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 text-white">
          <img src="${dest.image}" class="card-img-top" alt="${dest.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${dest.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${dest.subtitle}</h6>
            <p class="card-text">${dest.tagline}</p>
            <button class="btn btn-primary mt-auto start-tour" data-name="${dest.name}" data-description="${dest.description}" data-video="${dest.video}" data-link="${dest.link}" data-features='${JSON.stringify(dest.features)}'>
              Start VR Tour
            </button>
          </div>
        </div>
      </div>`;
    row.append(card);
  });
}

function openVRModal(button) {
  const name = button.data("name");
  const description = button.data("description");
  const video = button.data("video");
  const link = button.data("link");
  const features = button.data("features");

  $("#vrModalLabel").text(`${name} - Virtual Tour`);
  $("#vrDescription").text(description);
  $("#vrVideo").attr("src", `${video}?autoplay=1&mute=1&rel=0`);
  $("#exploreLink").attr("href", link);

  const featureList = $("#vrFeatures").empty();
  features.forEach(feature => {
    featureList.append(`<li class="list-group-item bg-dark text-light">🎯 ${feature}</li>`);
  });

  const modalEl = document.getElementById('vrModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  $('#vrModal').on('hidden.bs.modal', function () {
    $('#vrVideo').attr('src', '');
  });
}

$(document).ready(function() {
  buildCards(destinations);

  $('#searchInput').on('input', function() {
    const term = $(this).val().toLowerCase().trim();
    const filtered = destinations.filter(dest => {
      return dest.name.toLowerCase().includes(term) || dest.subtitle.toLowerCase().includes(term) || dest.tagline.toLowerCase().includes(term);
    });
    buildCards(filtered);
  });

  $(document).on('click', '.start-tour', function() {
    openVRModal($(this));
  });
});