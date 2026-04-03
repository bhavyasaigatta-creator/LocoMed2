let userLat = 17.4948;
let userLng = 78.3996;

// ✅ FIXED LOCATION FUNCTION
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    position => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

      console.log("Detected:", userLat, userLng);

      // 🔥 FIX: Check if location is too far (wrong laptop location)
      const distanceFromJNTU = getDistance(
        userLat,
        userLng,
        17.4948,
        78.3996
      );

      if (distanceFromJNTU > 20) {
        alert("Laptop location inaccurate → using JNTU location");

        userLat = 17.4948;
        userLng = 78.3996;
      } else {
        alert("Location detected correctly!");
      }
    },
    error => {
      alert("Location failed → using JNTU location");

      userLat = 17.4948;
      userLng = 78.3996;
    }
  );
}

// ✅ SEARCH FUNCTION
async function searchMedicine() {
  const input = document.getElementById("medicine").value.toLowerCase();

  const res = await fetch("data.json");
  const data = await res.json();

  let output = "";

  data.pharmacies.forEach(p => {
    const meds = p.medicines.map(m => m.toLowerCase());

    if (meds.includes(input)) {

      let distanceText = "";
      if (userLat && userLng) {
        const dist = getDistance(userLat, userLng, p.lat, p.lng);
        distanceText = `<p>Distance: ${dist.toFixed(2)} km</p>`;
      }

      output += `
        <div class="card" onclick="showOnMap(${p.lat}, ${p.lng})">
          <h3>${p.name}</h3>
          <p style="color:green;">✅ Available</p>
          ${distanceText}
        </div>
      `;
    }
  });

  if (output === "") {
    output = "<p style='color:red;'>❌ Not available</p>";
  }

  document.getElementById("results").innerHTML = output;
}

// 📏 DISTANCE FUNCTION
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 📍 MAP FUNCTION (mobile + laptop smooth scroll)
function showOnMap(lat, lng) {
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  document.getElementById("map").scrollIntoView({
    behavior: "smooth"
  });
}

// 🔐 LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}