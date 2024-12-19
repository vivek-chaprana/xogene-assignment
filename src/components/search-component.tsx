import { useCallback, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router";
import { BASE_URL } from "../lib/constants";
import { DrugConceptProperty, DrugSearchResponse, DrugSuggestionResponse } from "../types";

async function fetchDrugs(name: string): Promise<DrugConceptProperty[]> {
  try {
    const url = new URL(`${BASE_URL}/drugs.json`);
    url.searchParams.set("name", name);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch drugs.");

    const data = (await res.json()) as DrugSearchResponse;

    const drugs = data.drugGroup?.conceptGroup?.flatMap((cg) => cg.conceptProperties).filter(Boolean) || [];

    return drugs;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchSuggestions(name: string): Promise<string[]> {
  try {
    const url = new URL(`${BASE_URL}/spellingsuggestions.json`);
    url.searchParams.set("name", name);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch suggestions.");

    const data = (await res.json()) as DrugSuggestionResponse;

    const suggestions = data.suggestionGroup.suggestionList?.suggestion || [];

    return suggestions;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function SearchComponent() {
  const [drugs, setDrugs] = useState<DrugConceptProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchedOnce, setIsSearchedOnce] = useState(false);

  const handleSearch = useCallback(
    async function (suggestion?: string) {
      if (isLoading) return;
      setIsLoading(true);
      setDrugs([]);
      setSuggestions([]);

      const drugs = await fetchDrugs(suggestion || searchTerm);

      if (!!drugs.length) {
        setDrugs(drugs);
        setSuggestions([]);
      } else {
        const suggestions = await fetchSuggestions(searchTerm);
        setSuggestions(suggestions);
      }

      setIsSearchedOnce(true);
      setIsLoading(false);
    },
    [searchTerm]
  );

  async function handleSuggestionClick(suggestion: string) {
    setSearchTerm(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  }

  return (
    <div>
      <div className="relative">
        <div className="flex h-12 items-center gap-1 w-full rounded-lg px-2 bg-neutral-100 border border-neutral-700 ">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-2 py-1 text-md bg-transparent focus:outline-none flex-1"
          />
          <button className="span hover:bg-neutral-300 p-2 rounded-full" onClick={() => handleSearch()}>
            <BiSearch className="w-5 h-5" />
          </button>
        </div>

        {!!searchTerm.length && !!suggestions.length && (
          <div className="absolute top-12 left-0 right-0 border border-neutral-600 bg-neutral-50 rounded-md px-1 py-2">
            <h3>Did you mean ?</h3>
            <ul className="flex flex-col gap-2 ps-2 ">
              {!!suggestions.length &&
                suggestions.map((suggestion, index) => (
                  <li
                    onClick={() => handleSuggestionClick(suggestion)}
                    key={index}
                    className="hover:underline text-md cursor-pointer font-semibold  hover:text-blue-500 w-fit"
                  >
                    {suggestion}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <section className="flex flex-col gap-2">
        {isLoading ? (
          <div className="text-md text-center font-semibold py-10">Loading..</div>
        ) : !!drugs.length ? (
          drugs.map((drug) => (
            <Link to={`/${drug.rxcui}`} key={drug.rxcui} className="hover:bg-neutral-200 p-1 text-base hover:text-blue-600 hover:underline">
              {drug.name}
            </Link>
          ))
        ) : (
          <div className={`text-md text-center font-semibold py-10 ${!searchTerm.length || !isSearchedOnce ? "" : "text-red-500"}`}>
            {!!searchTerm.length && isSearchedOnce ? "No results found!" : "Start searching to see results."}
          </div>
        )}
      </section>
    </div>
  );
}
