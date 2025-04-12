import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [masjids, setMasjids] = useState([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMasjid, setNewMasjid] = useState({
    masjidName: "",
    masjidArea: "",
    masjidTime: "",
    lat: "",
    lng: "",
  });

  const fetchMasjids = async () => {
    try {
      const response = await axios.get(
        "https://jummah.muzammil.xyz/api/public/masjids/getall"
      );
      setMasjids(response.data);
    } catch (error) {
      console.error("Error fetching masjid data:", error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const extractCoordinates = (url) => {
    const regex = /q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
    const match = url.match(regex);
    return match
      ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
      : null;
  };

  const sortedMasjids = userLocation
    ? [...masjids]
        .map((masjid) => {
          const coords = extractCoordinates(masjid.location);
          const distance = coords
            ? getDistance(
                userLocation.lat,
                userLocation.lng,
                coords.lat,
                coords.lng
              )
            : null;
          return { ...masjid, distance };
        })
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : masjids;

  const filteredMasjids = sortedMasjids.filter(
    (masjid) =>
      masjid.masjidName.toLowerCase().includes(search.toLowerCase()) ||
      masjid.masjidArea.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchMasjids();
    getUserLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMasjid({ ...newMasjid, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const locationUrl = `https://maps.google.com/?q=${newMasjid.lat},${newMasjid.lng}`;
      const payload = {
        masjidName: newMasjid.masjidName,
        masjidArea: newMasjid.masjidArea,
        masjidTime: newMasjid.masjidTime,
        location: locationUrl,
      };
      await axios.post(
        "https://jummah.muzammil.xyz/api/public/masjids/addmasjid",
        payload
      );
      setIsModalOpen(false);
      fetchMasjids();
    } catch (error) {
      console.error("Error adding masjid:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🕌 Jummah Prayer Times
      </h1>

      <input
        type="text"
        placeholder="Search Masjid or Area..."
        className="w-full sm:w-96 px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={() => setIsModalOpen(true)}
      >
        ➕ Add Masjid
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredMasjids.length > 0 ? (
          filteredMasjids.map((masjid, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {masjid.masjidName}
              </h2>
              <p className="text-gray-600 mb-2">📍 {masjid.masjidArea}</p>
              <p className="text-gray-700 font-medium mb-2">
                🕒 Jumu'ah Time:{" "}
                <span className="text-green-600 font-bold">
                  {masjid.masjidTime}
                </span>
              </p>
              {typeof masjid.distance === "number" && (
                <p className="text-gray-700 font-bold mb-2">
                  🕌 {masjid.distance.toFixed(2)} km away
                </p>
              )}

              <div className="mt-auto">
                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => window.open(masjid.location, "_blank")}
                >
                  📍 Get Location
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg col-span-full text-center">
            No Masjids Found
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Masjid</h2>
            <input
              type="text"
              name="masjidName"
              placeholder="Masjid Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="masjidArea"
              placeholder="Masjid Area"
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="masjidTime"
              placeholder="Jumu'ah Time"
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lat"
              placeholder="Latitude"
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lng"
              placeholder="Longitude"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              onChange={handleInputChange}
            />
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              onClick={handleSubmit}
            >
              ➕ Add Masjid
            </button>
            <button
              className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setIsModalOpen(false)}
            >
              ✖️ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
