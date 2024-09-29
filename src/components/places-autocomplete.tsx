import { useTranslations } from "next-intl";
import { useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from "use-places-autocomplete";

interface Place {
  position: {
    lat: number;
    lng: number;
  };
  id: string;
  suggestedKeywords: string[];
}

interface AutocompletePlacesProps {
  setPlace: (place: Place) => void;
}

export const AutocompletePlaces: React.FC<AutocompletePlacesProps> = ({
  setPlace,
}) => {
  const t = useTranslations();

  const {
    value,
    setValue,
    suggestions: { data, loading, status },
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    requestOptions: {
      /* You can add types here to restrict results */
      // types: ['geocode', 'establishment'],
    },
    debounce: 300,
  });

  useEffect(() => {
    console.log("Suggestions data:", data);
    console.log("Suggestions loading:", loading);
    console.log("Suggestions status:", status);
  }, [data, loading, status]);

  const handleSelect = async (val: string, main_text: string) => {
    console.log("Selected:", val, main_text);
    setValue(main_text, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ placeId: val });
      console.log("Geocode results:", results);
      const details = await getDetails({ placeId: results[0].place_id });
      console.log("Place details:", details);
      const { lat, lng } = getLatLng(results[0]);
      console.log("LatLng:", lat, lng);

      setPlace({
        position: { lat, lng },
        // @ts-ignore
        id: details.place_id,
        // @ts-ignore
        suggestedKeywords: details.types || [],
      });
    } catch (error) {
      console.error("Error in handleSelect:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!document.querySelector("#SearchBox")?.contains(target)) {
        clearSuggestions();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [clearSuggestions]);

  return (
    <div className="w-full my-4">
      <div id="SearchBox" className="relative">
        <input
          className="my-2 w-full rounded-md p-3 shadow-md focus:ring-0 focus:outline-none focus:border focus:border-primary"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log("Input value changed:", e.target.value);
            setValue(e.target.value);
          }}
          placeholder={t("Search for places") + "..."}
          autoComplete="off"
        />
        {loading && <div>Loading...</div>}
        {status === "OK" && (
          <ul className="absolute top-10 w-full bg-content1 rounded-lg shadow-lg z-20 flex flex-col gap-1 bg-white shadow-blue-800/10">
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;
              return (
                <li
                  key={place_id}
                  onClick={() => handleSelect(place_id, main_text)}
                  className="p-2 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
